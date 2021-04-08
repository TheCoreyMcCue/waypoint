const express = require('express');
const airport = require('../models/airport');
const router = express.Router({ mergeParams: true });

const { validateReview } = require('../middleware');

const Airport = require('../models/airport');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.post('/', validateReview, catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    req.flash('success', `Your review for ${airport.name} was submitted`);
    res.redirect(`/airports/${airport._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    deleteAirport = airport.name
    await Airport.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review');
    res.redirect(`/airports/${id}`);
}));

module.exports = router;
