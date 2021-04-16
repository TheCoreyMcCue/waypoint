const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
     url: String,
        filename: String
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})
const AirportSchema = new Schema({
    name: String,
    images: [ImageSchema],
    description: String,
    location: String,
    icao: String,
    landingFee: Number,
    tieDown: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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