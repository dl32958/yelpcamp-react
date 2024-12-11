import express from 'express';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
};

mongoose.connect('mongodb://localhost:27017/yelpcamp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', () => {
    console.log('database connected');
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

// req.params -> {id: 'xxx'}
app.get('/campgrounds/:id', async (req, res) => {
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id);
    res.send({campground});
});

app.post('/campgrounds/new', async (req, res) => {
    // console.log(req.body);
    const campground = new Campground(req.body);
    await campground.save();
    res.send(campground._id);   // send back id
});

app.post('/campgrounds/:id/update', async (req, res) => {
    console.log(req.params.id);
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body});
    res.send(campground._id);
});

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.status(200).send('deleted');
});

app.get('/', (req, res) => {
    res.send('express app is answering');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});