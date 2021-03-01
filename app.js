const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Airport = require('./models/airport');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.get('/airports/:id', async (req, res) => {
    const airport = await Airport.findById(req.params.id)
    res.render('airports/show', { airport });
});

app.listen(3000, () => {
    console.log('port 3000 baby!');
});

