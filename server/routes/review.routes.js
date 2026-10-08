const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth.middleware');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const { orderBy, equalTo } = req.query;
    const query = ['roomId','userId','reviewId'].includes(orderBy) && typeof equalTo === 'string' ? { [orderBy]: equalTo } : {};
    const reviews = await Review.find(query);
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newReview = await Review.create({
      content: req.body.content, rating: req.body.rating, roomId: req.body.roomId,
      userId: req.user._id,
    });
    res.status(201).send(newReview);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.patch('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.sendStatus(404);
    if (String(review.userId) !== req.user._id && req.userRole !== 'admin') return res.sendStatus(403);
    const updatedReview = await Review.findByIdAndUpdate(reviewId, {content:req.body.content,rating:req.body.rating}, { returnDocument: 'after', runValidators:true });
    res.send(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const removedReview = await Review.findById(reviewId);
    if (!removedReview) return res.sendStatus(404);
    if (removedReview.userId.toString() === req.user._id || req.userRole === 'admin') {
      await removedReview.deleteOne();
      return res.send(null);
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

module.exports = router;
