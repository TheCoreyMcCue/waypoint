const Joi = require('joi');

module.exports.airportSchema = Joi.object({
    airport: Joi.object({
        name: Joi.string().required(),
        landingFee: Joi.number().required().min(0),
        tieDown: Joi.number().required().min(0),
        icao: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});
