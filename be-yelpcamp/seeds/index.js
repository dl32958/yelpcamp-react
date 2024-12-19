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
            images: [
                {
                    url: 'https://res.cloudinary.com/dvtqo8whc/image/upload/v1710783609/crbgbx5t560jeeg2nvgq.jpg',
                    filename: 'YelpCamp/crbgbx5t560jeeg2nvgq'
                },
                {
                    url: 'https://res.cloudinary.com/dvtqo8whc/image/upload/v1710783610/qa3jpz3vinidmguaogvb.jpg',
                    filename: 'YelpCamp/qa3jpz3vinidmguaogvb'
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});