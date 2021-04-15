const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Airport = require('../models/airport');
const airports = require('../controllers/airports');
const { isLoggedIn, validateAirport, isAuthor } = require('../middleware');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.post('/makeairport', catchAsync(airports.index));

router.get('/', catchAsync(async(req, res) => {
   const airports =  await Airport.find({});
   res.render('airports/index', { airports })
}));

router.get('/new', isLoggedIn, airports.renderNewForm);

// router.post('/', isLoggedIn, validateAirport, catchAsync(airports.createAirport));
router.post('/', upload.single('image'), (req, res) => {
   console.log(req.body, req.file);
   res.send("It worked!");
})

router.get('/:id', catchAsync(airports.showAirport));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(airports.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateAirport, catchAsync(airports.updateAirport));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(airports.delete));

module.exports = router;
