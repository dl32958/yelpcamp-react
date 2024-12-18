import express from 'express';
import Campground from '../models/Campground.js';
import Review from '../models/Review.js';
import CatchAsync from '../utils/CatchAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { campgroundSchema } from '../schemas.js';
import { isLoggedIn, isAuthor } from '../middleware.js';

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
    // console.log("req.headers",req.headers);
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

// req.params -> {id: 'xxx'}
router.get('/:id', CatchAsync(async (req, res) => {
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id)
        .populate({path: "reviews", populate:{path: "author"}})      // populate reviews
        .populate("author");
    console.log("campground:", campground);
    res.send({campground});
}));

router.post('/new', isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    console.log(req.body);
    const campground = new Campground(req.body.campground);
    // console.log(req.user);
    campground.author = req.user.id;
    await campground.save();
    console.log(campground);
    res.send(campground._id);   // send back _id
}));

router.post('/:id/update', isLoggedIn, isAuthor, validateCampground, CatchAsync(async (req, res, next) => {
    // console.log("req.body:", req.body);
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.send(campground._id);
}));

router.delete('/:id/delete', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    if (!campground) {
        res.status(404).send('Campground does not exist!');
    }
    res.status(200).send('Campground deleted successfully!');
}));

export default router;