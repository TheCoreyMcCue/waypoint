const Airport = require('../models/airport');

module.exports.index = async (req, res) => {
    const portOne = new Airport({ name: 'Thun Field', description: 'Pierce County Airport' });
    await portOne.save();
    res.send(portOne);
};

module.exports.renderNewForm = (req, res) => {
    res.render('airports/new');
};

module.exports.createAirport = async (req, res, next) => {
    const airport = new Airport(req.body.airport);
    airport.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    airport.author = req.user._id;
    await airport.save();
    req.flash('success', 'Your airport has been successfully added!');
    res.redirect(`/airports/${airport._id}`);
};

module.exports.showAirport = async (req, res) => {
    const airport = await Airport.findById(req.params.id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author');
    if(!airport){
        req.flash('error', 'Oops, it looks like that airport does not exist');
        return res.redirect('/airports');
    }
    res.render('airports/show', { airport });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const airport = await Airport.findById(id);
    if(!airport){
        req.flash('error', 'Oops, it looks like that airport does not exist');
        return res.redirect('/airports');
    }
    res.render('airports/edit', { airport });
};

module.exports.updateAirport = async(req, res) => {
    const { id } = req.params;
    const airport = await Airport.findByIdAndUpdate(id, { ...req.body.airport });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    airport.images.push(...imgs);
    await airport.save();
    req.flash('success', `Successfully updated ${airport.name}`);
    res.redirect(`/airports/${airport._id}`);
};

module.exports.delete = async(req, res) => {
    const { id } = req.params;
    await Airport.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted airport');

    res.redirect('/airports');
};