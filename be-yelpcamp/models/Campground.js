import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const CampgroundSchema = new Schema({
    title: String,
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
    price: Number,
    description: String,
    location: String,
    image: String,
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
});


export default mongoose.model('Campground', CampgroundSchema);