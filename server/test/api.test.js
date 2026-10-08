process.env.NODE_ENV = 'test';
process.env.STRIPE_SECRET_KEY = 'sk_test_local';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local_test';
process.env.MONGOMS_DOWNLOAD_DIR = require('path').join(__dirname, '../../.cache/mongodb');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const Stripe = require('stripe');
const app = require('../httpApp');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Night = require('../models/ReservationNight');
const { overlaps, priceForStay } = require('../utils/bookingPolicy');
const tokenService = require('../services/token.service');
let db, room, otherRoom, user, admin, outsider;
const bearer = u => `Bearer ${tokenService.generate({ _id: String(u._id) }).accessToken}`;
const date = offset => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const input = (id, start = 10, end = 12) => ({ roomId: String(id), arrivalDate: date(start), departureDate: date(end), adults: 2, children: 0, babies: 0, totalPrice: 1 });
describe('Hotel product API', { timeout: 180000 }, () => {
  before(async () => {
    db = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    await mongoose.connect(db.getUri('test'));
    await Promise.all([Night.init(), User.init()]);
    [room, otherRoom] = await Room.create([{ roomNumber: 1, price: 1000 }, { roomNumber: 2, price: 1200 }]);
    [user, admin, outsider] = await User.create([{ email: 'user@test.com', password: 'private', role: 'user' }, { email: 'admin@test.com', role: 'admin' }, { email: 'outsider@test.com', role: 'user' }]);
  });
  after(async () => { await mongoose.disconnect(); if (db) await db.stop(); });
  it('checks health, authentication and invalid dates', async () => {
    await request(app).get('/api/health').expect(200);
    await request(app).get('/api/booking').expect(401);
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 12, 10)).expect(400);
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send({ ...input(room._id), adults: -1 }).expect(400);
  });
  it('calculates price on the server and permits separate rooms and adjacent stays', async () => {
    const result = await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id)).expect(201);
    assert.equal(result.body.totalPrice, 2100);
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(otherRoom._id)).expect(201);
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 12, 13)).expect(201);
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 9, 14)).expect(409);
    const list = await request(app).get(`/api/rooms?arrivalDate=${+new Date(date(10))}&departureDate=${+new Date(date(11))}`).expect(200);
    assert.equal(list.body.length, 0);
  });
  it('prevents concurrent bookings at the database level', async () => {
    const results = await Promise.all([1, 2, 3].map(() => request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 20, 22))));
    assert.deepEqual(results.map(r => r.status).sort(), [201, 409, 409]);
    assert.equal(await Night.countDocuments({ roomId: room._id, day: date(20) }), 1);
  });
  it('hides other guests bookings and protects account roles and room editing', async () => {
    const list = await request(app).get('/api/booking?orderBy=userId&equalTo=any').set('Authorization', bearer(outsider)).expect(200);
    assert.equal(list.body.length, 0);
    const users = await request(app).get('/api/user').expect(200);
    assert.ok(users.body.every(u => !u.password && !u.email));
    const result = await request(app).patch(`/api/user/${user._id}`).set('Authorization', bearer(user)).send({ role: 'admin', password: 'hacked', firstName: 'Updated' }).expect(200);
    assert.equal(result.body.role, 'user'); assert.equal(result.body.password, undefined);
    await request(app).patch(`/api/rooms/${room._id}`).set('Authorization', bearer(user)).send({ price: 1 }).expect(403);
    const booking = await Booking.findOne({ userId: user._id });
    await request(app).delete(`/api/booking/${booking._id}`).set('Authorization', bearer(outsider)).expect(403);
  });
  it('cancels and releases inventory atomically', async () => {
    const result = await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 30, 32)).expect(201);
    await request(app).delete(`/api/booking/${result.body._id}`).set('Authorization', bearer(user)).expect(200);
    assert.equal(await Night.countDocuments({ bookingId: result.body._id }), 0);
    assert.equal((await Booking.findById(result.body._id)).status, 'cancelled');
    await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 30, 32)).expect(201);
  });
  it('accepts only signed matching payments and processes webhook repeats safely', async () => {
    const result = await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 40, 42)).expect(201);
    await Booking.updateOne({ _id: result.body._id }, { checkoutSessionId: 'cs_test' });
    const checkout = { id: 'cs_test', metadata: { bookingId: result.body._id }, payment_status: 'paid', payment_intent: 'pi_test', currency: 'uah', amount_total: 210000 };
    const send = async object => {
      const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed', data: { object } });
      const header = new Stripe('sk_test').webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET });
      return request(app).post('/api/payments/webhook').set('Content-Type', 'application/json').set('stripe-signature', header).send(payload);
    };
    await request(app).post('/api/payments/webhook').set('Content-Type', 'application/json').send('{}').expect(400);
    assert.equal((await send({ ...checkout, amount_total: 1 })).status, 200);
    assert.equal((await Booking.findById(result.body._id)).paymentStatus, 'unpaid');
    assert.equal((await send(checkout)).status, 200); assert.equal((await send(checkout)).status, 200);
    assert.equal((await Booking.findById(result.body._id)).paymentStatus, 'paid');
    await request(app).delete(`/api/booking/${result.body._id}`).set('Authorization', bearer(user)).expect(409);
    await request(app).post(`/api/payments/refund/${result.body._id}`).set('Authorization', bearer(user)).expect(403);
  });
  it('validates boundary overlaps and price arithmetic', () => {
    assert.equal(overlaps({ arrivalDate: '2030-01-01', departureDate: '2030-01-03' }, { arrivalDate: '2030-01-03', departureDate: '2030-01-04' }), false);
    assert.equal(priceForStay(1000, 2), 2100);
  });
  it('creates Checkout with server pricing, reuses sessions and refunds with idempotency', async () => {
    let created = 0, refunded = 0;
    app.locals.paymentClient = {
      checkout: { sessions: {
        create: async (data, options) => {
          created++;
          assert.equal(data.line_items[0].price_data.unit_amount, 210000);
          assert.equal(data.line_items[0].price_data.currency, 'uah');
          assert.match(options.idempotencyKey, /^booking-/);
          assert.match(data.success_url, /^http:\/\/localhost:5173\/profile\//);
          return { id: 'cs_checkout_test', url: 'https://checkout.stripe.com/test' };
        },
        retrieve: async () => ({ status: 'open', url: 'https://checkout.stripe.com/test' }),
        expire: async () => ({}),
      } },
      refunds: { create: async (data, options) => { refunded++; assert.equal(data.payment_intent, 'pi_refund_test'); assert.match(options.idempotencyKey, /^refund-/); return { status: 'succeeded' }; } },
    };
    try {
      const result = await request(app).post('/api/booking').set('Authorization', bearer(user)).send(input(room._id, 50, 52)).expect(201);
      const url = `/api/payments/checkout/${result.body._id}`;
      await request(app).post(url).set('Authorization', bearer(outsider)).expect(403);
      await request(app).post(url).set('Authorization', bearer(user)).send({ totalPrice: 1 }).expect(200);
      await request(app).post(url).set('Authorization', bearer(user)).expect(200);
      assert.equal(created, 1);
      await Booking.updateOne({ _id: result.body._id }, { paymentStatus: 'paid', paymentIntentId: 'pi_refund_test' });
      const refundUrl = `/api/payments/refund/${result.body._id}`;
      await request(app).post(refundUrl).set('Authorization', bearer(admin)).expect(200);
      await request(app).post(refundUrl).set('Authorization', bearer(admin)).expect(200);
      assert.equal(refunded, 1);
      const booking = await Booking.findById(result.body._id);
      assert.equal(booking.paymentStatus, 'refunded'); assert.equal(booking.status, 'cancelled');
      assert.equal(await Night.countDocuments({ bookingId: booking._id }), 0);
      await request(app).post(url).set('Authorization', bearer(user)).expect(409);
    } finally { delete app.locals.paymentClient; }
  });
  it('registration ignores roles, private fields are hidden and refresh tokens rotate', async () => {
    const result = await request(app).post('/api/auth/signUp').send({ email: 'new@test.com', password: 'NewPassword123!', firstName: 'Guest', secondName: 'Test', role: 'admin' }).expect(201);
    const stored = await User.findById(result.body.userId);
    assert.equal(stored.role, 'user'); assert.notEqual(stored.password, 'NewPassword123!');
    const login = await request(app).post('/api/auth/signInWithPassword').send({ email: 'new@test.com', password: 'NewPassword123!' }).expect(200);
    const refreshed = await request(app).post('/api/auth/token').send({ refresh_token: login.body.refreshToken }).expect(200);
    assert.notEqual(refreshed.body.refreshToken, login.body.refreshToken);
    await request(app).post('/api/auth/token').send({ refresh_token: login.body.refreshToken }).expect(401);
  });
});
