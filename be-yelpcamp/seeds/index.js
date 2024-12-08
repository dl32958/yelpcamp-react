import mongoose from 'mongoose';
import {cities} from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import Campground from '../models/campground.js';

mongoose.connect('mongodb://localhost:27017/yelpcamp');
const db = mongoose.connection;

db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});