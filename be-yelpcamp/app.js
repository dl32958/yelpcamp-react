import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ExpressError from './utils/ExpressError.js';
import campgroundRoutes from './routes/campground.js';
import reviewRoutes from './routes/reviews.js';
import session from 'express-session';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
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

const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
app.use(session(sessionConfig));

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


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