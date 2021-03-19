const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { airportSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Airport = require('./models/airport');
const Review = require('./models/review');
const airports = require('./routes/airports')
const methodOverride = require('method-override');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(result.error.details, 400)
    } else {
        next();
    }
}

mongoose.connect('mongodb://localhost:27017/waypoint', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/airports', airports);

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/airports/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    res.redirect(`/airports/${airport._id}`);
}));

app.delete('/airports/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Airport.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/airports/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Cessna Titan Error (404)', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Clearance denied'} = err;
    if (!err.message) err.message = "It appears that you don't have that ATC clearance"
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('port 3000 baby!');
});