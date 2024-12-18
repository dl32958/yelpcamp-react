import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ExpressError from './utils/ExpressError.js';
import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

// mongoDB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';
mongoose.connect('mongodb://localhost:27017/yelpcamp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error:'));
db.once('open', () => {
    console.log('database connected');
});
// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/users', userRoutes);

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