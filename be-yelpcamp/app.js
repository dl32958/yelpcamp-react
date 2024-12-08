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

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

app.get('/', (req, res) => {
    res.send('express app is answering');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});