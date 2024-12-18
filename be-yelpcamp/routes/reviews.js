import express from 'express';
import Campground from '../models/Campground.js';
import Review from '../models/Review.js';
import CatchAsync from '../utils/CatchAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { reviewSchema } from '../schemas.js';
import { isLoggedIn, isReviewAuthor } from '../middleware.js';

const router = express.Router({mergeParams: true});   // inherit params from parent

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post('/', validateReview, isLoggedIn, CatchAsync(async (req, res) => {
    console.log(req.body);
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user.id;
    // console.log(newReview);
    campground.reviews.push(newReview);    // push new review to reviews array
    await newReview.save();
    await campground.save();
    res.send({campground});
    res.status(200).send("Review added successfully!");
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, CatchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});  // delete reference
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) {
        res.status(404).send('Review does not exist!');
    }
    res.status(200).send('Review deleted successfully!');
}));

export default router;