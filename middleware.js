const { airportSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Airport = require('./models/airport');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to add an airport');
        return res.redirect('/login');
    }
    next()
}

module.exports.validateAirport = (req, res, next) => {
    const { error } = airportSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(result.error.details, 400)
    } else {
        next();
    };
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const airport = await Airport.findById(id);
    if (!airport.author.equals(req.user._id)) {
        req.flash('error', 'No fly zone!');
        return res.redirect(`/airports/${id}`);
    };
    next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'No fly zone!');
        return res.redirect(`/airports/${id}`);
    };
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(result.error.details, 400)
    } else {
        next();
    }
};