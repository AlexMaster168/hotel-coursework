const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = express.Router();
router.get('/', (req, res, next) => req.headers.authorization ? auth(req, res, next) : next(), async (req, res) => {
  const publicFields = ['_id', 'firstName', 'secondName', 'avatarPhoto'];
  if (!req.user) return res.json(await User.find().select(publicFields.join(' ')));
  const users = await User.find().select('-password');
  res.json(users.map(user => String(user._id) === req.user._id || req.userRole === 'admin' ? user : Object.fromEntries(publicFields.map(key => [key, user[key]]))));
});
router.patch('/:userId', auth, async (req, res) => {
  if (req.params.userId !== req.user._id) return res.sendStatus(403);
  const fields = ['firstName', 'secondName', 'subscribe', 'birthYear', 'avatarPhoto', 'gender'];
  const updates = Object.fromEntries(fields.filter(key => Object.hasOwn(req.body, key)).map(key => [key, req.body[key]]));
  res.json(await User.findByIdAndUpdate(req.user._id, updates, { returnDocument: 'after', runValidators: true }).select('-password'));
});
module.exports = router;
