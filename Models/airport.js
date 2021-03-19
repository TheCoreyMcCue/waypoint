const mongoose = require('mongoose');
const Review = require('./review');
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

AirportSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Airport', AirportSchema);