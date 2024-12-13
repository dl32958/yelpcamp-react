import express from 'express';
import mongoose from 'mongoose';
import Campground from './models/Campground.js';
import Review from './models/Review.js';
import cors from 'cors';
import CatchAsync from './utils/CatchAsync.js';
import ExpressError from './utils/ExpressError.js';
import { campgroundSchema, reviewSchema } from './schemas.js';

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

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

// req.params -> {id: 'xxx'}
app.get('/campgrounds/:id', CatchAsync(async (req, res) => {
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate('reviews');  // populate reviews
    // console.log(campground);
    res.send({campground});
}));

app.post('/campgrounds/:id/reviews', validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);    // push new review to reviews array
    await newReview.save();
    await campground.save();
    res.send({campground});
}));

app.delete('/campgrounds/:id/reviews/:reviewId', CatchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});  // delete reference
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).send('review is deleted');
}));

app.post('/campgrounds/new', validateCampground, CatchAsync(async (req, res, next) => {
    // console.log(req.body);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.send(campground._id);   // send back id
}));

app.post('/campgrounds/:id/update', validateCampground, CatchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.send(campground._id);
}));

app.delete('/campgrounds/:id/delete', CatchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.status(200).send('deleted');
}));

app.get('/', (req, res) => {
    res.send('express app is answering');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('404 Page not found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).send(message);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});