const { Schema, model } = require('mongoose');
const schema = new Schema({ roomId: { type: Schema.Types.ObjectId, required: true }, bookingId: { type: Schema.Types.ObjectId, required: true, index: true }, day: { type: String, required: true } });
schema.index({ roomId: 1, day: 1 }, { unique: true });
module.exports = model('ReservationNight', schema);
