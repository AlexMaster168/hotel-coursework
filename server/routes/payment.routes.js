const express = require('express');
const Stripe = require('stripe');
const auth = require('../middleware/auth.middleware');
const Booking = require('../models/Booking');
const { cancelBooking } = require('../services/booking.service');
const settings = require('../settings');
const router = express.Router();
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw Object.assign(new Error('PAYMENTS_NOT_CONFIGURED'), { status: 503 });
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
async function ownedBooking(req) {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) throw Object.assign(new Error('BOOKING_NOT_FOUND'), { status: 404 });
  if (String(booking.userId) !== req.user._id && req.userRole !== 'admin') throw Object.assign(new Error('FORBIDDEN'), { status: 403 });
  return booking;
}
router.get('/config', (req, res) => res.json({ enabled: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET), currency: 'uah' }));
router.post('/checkout/:bookingId', auth, async (req, res) => {
  const booking = await ownedBooking(req);
  if (booking.status === 'cancelled' || booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded') return res.status(409).json({ message: 'Booking is not payable' });
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw Object.assign(new Error('PAYMENTS_NOT_CONFIGURED'), { status: 503 });
  const stripe = req.app.locals.paymentClient || getStripe();
  let previous;
  if (booking.checkoutSessionId) {
    previous = await stripe.checkout.sessions.retrieve(booking.checkoutSessionId);
    if (previous.status === 'open') return res.json({ url: previous.url });
    if (previous.status === 'complete') return res.status(409).json({ message: 'Payment is being confirmed' });
  }
  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment', locale: req.body.language === 'en' ? 'en-GB' : 'auto', client_reference_id: String(booking._id), metadata: { bookingId: String(booking._id) },
    payment_method_types: ['card'],
    line_items: [{ quantity: 1, price_data: { currency: 'uah', unit_amount: Math.round(booking.totalPrice * 100), product_data: { name: `Toxin — ${req.body.language === 'en' ? 'booking' : 'бронювання'} ${booking._id}` } } }],
    success_url: `${settings.origin}/profile/${req.user._id}/booking?payment=success`,
    cancel_url: `${settings.origin}/profile/${req.user._id}/booking?payment=cancelled`,
  }, { idempotencyKey: `booking-${booking._id}-${previous?.id || 'first'}` });
  const saved = await Booking.updateOne({ _id: booking._id, status: { $ne: 'cancelled' }, paymentStatus: { $nin: ['paid', 'refunded'] } }, { checkoutSessionId: checkout.id });
  if (!saved.matchedCount) { await stripe.checkout.sessions.expire(checkout.id); return res.sendStatus(409); }
  res.json({ url: checkout.url });
});
router.post('/refund/:bookingId', auth, async (req, res) => {
  if (req.userRole !== 'admin') return res.sendStatus(403);
  const booking = await ownedBooking(req);
  if (booking.paymentStatus === 'refunded') { if (booking.status !== 'cancelled') await cancelBooking(booking._id); return res.json({ status: 'refunded' }); }
  if (booking.paymentStatus !== 'paid' || !booking.paymentIntentId) return res.status(409).json({ message: 'No paid payment to refund' });
  const refund = await (req.app.locals.paymentClient || getStripe()).refunds.create({ payment_intent: booking.paymentIntentId }, { idempotencyKey: `refund-${booking._id}` });
  if (refund.status !== 'succeeded') return res.status(202).json({ status: refund.status, message: 'Refund pending; retry to reconcile.' });
  await Booking.updateOne({ _id: booking._id }, { paymentStatus: 'refunded', refundedAt: new Date() });
  await cancelBooking(booking._id);
  res.json({ status: 'refunded' });
});
async function webhook(req, res, next) {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) return res.sendStatus(503);
    let event;
    try { event = getStripe().webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET); }
    catch { return res.status(400).json({ message: 'Invalid webhook signature' }); }
    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
      const checkout = event.data.object;
      if (checkout.payment_status === 'paid') {
        const booking = await Booking.findOne({ _id: checkout.metadata?.bookingId, checkoutSessionId: checkout.id, status: { $ne: 'cancelled' } });
        if (!booking && checkout.metadata?.bookingId) {
          const pending = await Booking.findById(checkout.metadata.bookingId);
          if (pending && !pending.checkoutSessionId && pending.status !== 'cancelled') return res.sendStatus(503);
        }
        if (booking && checkout.currency === 'uah' && checkout.amount_total === Math.round(booking.totalPrice * 100)) {
          await Booking.updateOne({ _id: booking._id, paymentStatus: { $nin: ['paid', 'refunded'] } }, { paymentStatus: 'paid', paidAt: new Date(), paymentIntentId: checkout.payment_intent });
        }
      }
    }
    res.json({ received: true });
  } catch (error) { next(error); }
}
async function expireCheckout(id, client) {
  const stripe = client || getStripe();
  const checkout = await stripe.checkout.sessions.retrieve(id);
  if (checkout.status === 'complete') throw Object.assign(new Error('PAYMENT_IN_PROGRESS'), { status: 409 });
  if (checkout.status === 'open') await stripe.checkout.sessions.expire(id);
}
module.exports = { router, webhook, expireCheckout };
