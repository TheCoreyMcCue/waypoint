const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirportSchema = new Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    icao: String,
    landingFee: Number,
    tieDown: Number
});

module.exports = mongoose.model('Airport', AirportSchema);