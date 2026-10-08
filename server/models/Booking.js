const { Schema, model, SchemaTypes } = require('mongoose');

const schema = new Schema({
  adults: Number,
  babies: Number,
  children: Number,
  arrivalDate: Date,
  departureDate: Date,
  roomId: { type: SchemaTypes.ObjectId, ref: 'Room' },
  userId: { type: SchemaTypes.ObjectId, ref: 'User' },
  totalPrice: Number,
  expires_at: Number,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  checkoutSessionId: String,
  paymentIntentId: String,
  paidAt: Date,
  refundedAt: Date,
});

module.exports = model('Booking', schema);
