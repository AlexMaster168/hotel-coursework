const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = model('Review', schema);
