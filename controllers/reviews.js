const Airport = require('../models/airport');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    req.flash('success', `Your review for ${airport.name} was submitted`);
    res.redirect(`/airports/${airport._id}`);
};

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Airport.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review');
    res.redirect(`/airports/${id}`);
};