import express from 'express';
import User from '../models/User.js';
import CatchAsync from '../utils/CatchAsync.js';
import ExpressError from '../utils/ExpressError.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRETE = process.env.JWT_SECRETE || "thisisnotagoodsecrete";

router.post('/register', CatchAsync(async (req, res) => {
    try {
        const { email, password } = req.body.user;
        console.log(email, password);
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new ExpressError('User already exists!', 409);
        }
        const newUser = new User({ email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRETE, { expiresIn: '1h' });
        console.log(token);
        res.status(200).json({
            message: 'Login successful!',
            token,
            // user: {
            //     id: newUser._id,
            //     email: newUser.email
            // }
        })
    } catch (e) {
        throw new ExpressError(e.message, 409);
    }
}));

router.post('/login', CatchAsync(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body.user;
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ExpressError('Invalid email or password!', 401);
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
        throw new ExpressError('Invalid email or password!', 401);
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRETE, { expiresIn: '1h' });
    res.status(200).json({
        message: 'Login successful!',
        token,
        // user: {
        //     id: user._id,
        //     email: user.email
        // }
    })
}));

router.get('/get-user', CatchAsync(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRETE);
        console.log('decoded',decoded);
        res.status(200).send(decoded);
    } catch (e) {
        res.status(401).send('Unauthorized');
    }
}));

export default router;
