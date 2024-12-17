import mongoose from 'mongoose';
import {cities} from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import Campground from '../models/Campground.js';

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
            author: "67612835715fe9f969d4a2eb",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            image: "https://plus.unsplash.com/premium_photo-1680788452823-49bb63651490?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});