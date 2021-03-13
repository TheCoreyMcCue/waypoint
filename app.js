const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Airport = require('./models/airport');
const methodOverride = require('method-override');

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

app.get('/', (req, res) => {
    res.render('home');
});
app.post('/makeairport', async (req, res) => {
    const portOne = new Airport({ name: 'Thun Field', description: 'Pierce County Airport' });
    await portOne.save();
    res.send(portOne);
});

app.get('/airports', async(req, res) => {
   const airports =  await Airport.find({});
   res.render('airports/index', { airports })
});

app.get('/airports/new', (req, res) => {
    res.render('airports/new');
});

app.post('/airports', async (req, res) => {
    const airport = new Airport(req.body.airport);
    await airport.save();
    res.redirect(`/airports/${airport._id}`);
})

app.get('/airports/:id', async (req, res) => {
    const airport = await Airport.findById(req.params.id)
    res.render('airports/show', { airport });
});

app.get('/airports/:id/edit', async (req, res) => {
    const airport = await Airport.findById(req.params.id)
    res.render('airports/edit', { airport });
});

app.put('/airports/:id', async(req, res) => {
    const { id } = req.params;
    const airport = await Airport.findByIdAndUpdate(id, { ...req.body.airport });
    res.redirect(`/airports/${airport._id}`);
});

app.delete('/airports/:id', async(req, res) => {
    const { id } = req.params;
    await Airport.findByIdAndDelete(id);
    res.redirect('/airports');
});

app.listen(3000, () => {
    console.log('port 3000 baby!');
});

