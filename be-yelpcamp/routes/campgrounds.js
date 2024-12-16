import express from 'express';
import Campground from '../models/Campground.js';
import Review from '../models/Review.js';
import CatchAsync from '../utils/CatchAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { campgroundSchema } from '../schemas.js';

const router = express.Router();

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

// req.params -> {id: 'xxx'}
router.get('/:id', CatchAsync(async (req, res) => {
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate('reviews');  // populate reviews
    // console.log(campground);
    res.send({campground});
}));

router.post('/new', validateCampground, CatchAsync(async (req, res, next) => {
    // console.log(req.body);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.send(campground._id);   // send back id
}));

router.post('/:id/update', validateCampground, CatchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.send(campground._id);
}));

router.delete('/:id/delete', CatchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.status(200).send('deleted');
}));

export default router;