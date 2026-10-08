const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Night = require('../models/ReservationNight');
const { stayDates, priceForStay } = require('../utils/bookingPolicy');
async function createBooking(input, userId) {
  if (!mongoose.isValidObjectId(input.roomId)) throw Object.assign(new Error('INVALID_ROOM'), { status: 400 });
  const dates = stayDates(input.arrivalDate, input.departureDate);
  const adults = Number(input.adults), children = Number(input.children || 0), babies = Number(input.babies || 0);
  if (![adults, children, babies].every(x => Number.isInteger(x) && x >= 0) || adults < 1 || adults + children + babies > 6) throw Object.assign(new Error('INVALID_GUESTS'), { status: 400 });
  try {
    return await mongoose.connection.transaction(async session => {
      const room = await Room.findById(input.roomId).session(session);
      if (!room) throw Object.assign(new Error('ROOM_NOT_FOUND'), { status: 404 });
      const existing = await Booking.exists({ roomId: room._id, status: { $ne: 'cancelled' }, arrivalDate: { $lt: dates.end }, departureDate: { $gt: dates.start } }).session(session);
      if (existing) throw Object.assign(new Error('BOOKING_EXIST'), { status: 409 });
      const [booking] = await Booking.create([{ roomId: room._id, userId, adults, children, babies, arrivalDate: dates.start, departureDate: dates.end, totalPrice: priceForStay(room.price, dates.days.length), status: 'confirmed', paymentStatus: 'unpaid' }], { session });
      await Night.insertMany(dates.days.map(day => ({ roomId: room._id, bookingId: booking._id, day })), { session });
      await Room.updateOne({ _id: room._id }, { $addToSet: { bookings: booking._id } }, { session });
      return booking;
    });
  } catch (error) {
    if (error.code === 11000) throw Object.assign(new Error('BOOKING_EXIST'), { status: 409 });
    throw error;
  }
}
async function cancelBooking(bookingId) {
  return mongoose.connection.transaction(async session => {
    const booking = await Booking.findOneAndUpdate({ _id: bookingId, status: { $ne: 'cancelled' }, paymentStatus: { $ne: 'paid' } }, { status: 'cancelled' }, { returnDocument: 'after', session });
    if (!booking) throw Object.assign(new Error('BOOKING_CANNOT_BE_CANCELLED'), { status: 409 });
    await Night.deleteMany({ bookingId }, { session });
    await Room.updateOne({ _id: booking.roomId }, { $pull: { bookings: booking._id } }, { session });
    return booking;
  });
}
module.exports = { createBooking, cancelBooking };
