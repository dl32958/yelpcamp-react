import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Load env variables

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

cloudinary.api.ping()
    .then(response => console.log("Cloudinary Connection Successful:", response))
    .catch(error => console.error("Cloudinary Connection Failed:", error));