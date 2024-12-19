import ExpressError from './utils/ExpressError.js';
import { campgroundSchema, reviewSchema } from "./schemas.js";
import Campground from "./models/Campground.js";
import Review from "./models/Review.js";
import jwt from 'jsonwebtoken';

const JWT_SECRETE = process.env.JWT_SECRETE || "thisisnotagoodsecrete";

export const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

export const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send('Unauthorized');
        }

        const decoded = jwt.verify(token, JWT_SECRETE);
        req.user = decoded;
        next();
    } catch (e) {
        console.error("JWT Verification Error:", e.message);
        return res.status(401).send('Unauthorized');
    }
};

export const isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user.id)) {
            return res.status(401).send("You don't have permission to do that!");
        } 
        next();
    } catch (e) {
        console.error("isAuthor Error:", e.message);
        return res.status(500).send('Internal Server Error');
    }
};

export const isReviewAuthor = async (req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    console.log("checking review author", review);
    if (!review.author.equals(req.user.id)) {
        return res.status(401).send("You don't have permission to do that!");
    }
    next();
};