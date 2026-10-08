const { Schema, model } = require('mongoose');

const schema = new Schema({
  roomNumber: Number,
  price: { type: Number, min: 1, required: true },
  countReviews: Number,
  rate: Number,
  images: [String],
  comforts: [String],
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  type: { type: String, enum: ['Стандарт', 'Люкс'] },
  hasWifi: Boolean,
  hasConditioner: Boolean,
  hasWorkSpace: Boolean,
  canSmoke: Boolean,
  canPets: Boolean,
  canInvite: Boolean,
  hasWideCorridor: Boolean,
  hasDisabledAssistant: Boolean,
});

module.exports = model('Room', schema);
