import mongoose from "mongoose";
import Review from "./Review.js";

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
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// delete all of reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        try{
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews
                }
            })
            console.log('Associated reviews deleted successfully');
        } catch (e) {
            console.error('Error occurred while deleting associated reviews:', e);
        }
    }
});

export default mongoose.model('Campground', CampgroundSchema);