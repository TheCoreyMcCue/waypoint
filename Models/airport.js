const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirportSchema = new Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    icao: String,
    landingFee: Number,
    tieDown: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Airport', AirportSchema);