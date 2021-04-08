const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Airport = require('../models/airport');
const { isLoggedIn, validateAirport, isAuthor } = require('../middleware');

router.post('/makeairport', catchAsync(async (req, res) => {
    const portOne = new Airport({ name: 'Thun Field', description: 'Pierce County Airport' });
    await portOne.save();
    res.send(portOne);
}));

router.get('/', catchAsync(async(req, res) => {
   const airports =  await Airport.find({});
   res.render('airports/index', { airports })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('airports/new');
});

router.post('/', isLoggedIn, validateAirport, catchAsync(async (req, res, next) => {
    // if(!req.body.airport) throw new ExpressError('Invalid Airport Data', 400);
    const airport = new Airport(req.body.airport);
    airport.author = req.user._id;
    await airport.save();
    req.flash('success', 'Your airport has been successfully added!');
    res.redirect(`/airports/${airport._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const airport = await Airport.findById(req.params.id).populate('reviews').populate('author');
    console.log(airport)
    if(!airport){
        req.flash('error', 'Oops, it looks like that airport does not exist');
        return res.redirect('/airports');
    }
    res.render('airports/show', { airport });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const airport = await Airport.findById(id);
    if(!airport){
        req.flash('error', 'Oops, it looks like that airport does not exist');
        return res.redirect('/airports');
    }
    res.render('airports/edit', { airport });
}));

router.put('/:id', isLoggedIn, isAuthor, validateAirport, catchAsync(async(req, res) => {
    const { id } = req.params;
    const airport = await Airport.findByIdAndUpdate(id, { ...req.body.airport });
    req.flash('success', `Successfully updated ${airport.name}`);
    res.redirect(`/airports/${airport._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Airport.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted airport');

    res.redirect('/airports');
}));

module.exports = router;
