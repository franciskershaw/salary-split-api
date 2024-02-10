const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  acceptsFunds: {
    type: Boolean,
    required: true,
    default: true,
  },
  excludeFromTotal: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Account', AccountSchema);
