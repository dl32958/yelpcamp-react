import express from 'express';
import Campground from '../models/Campground.js';
import CatchAsync from '../utils/CatchAsync.js';
import { isLoggedIn, isAuthor, validateCampground } from '../middleware.js';
import multer from 'multer';
import storage from '../cloudinary/index.js';

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
    // console.log("req.headers",req.headers);
    const campgrounds = await Campground.find({});
    res.send({campgrounds});
});

// req.params -> {id: 'xxx'}
router.get('/:id', CatchAsync(async (req, res) => {
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id)
        .populate({path: "reviews", populate:{path: "author"}})      // populate reviews
        .populate("author");
    console.log("campground:", campground);
    res.send({campground});
}));

router.post('/new', upload.array('image'), isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    console.log("req.body:", req.body);
    console.log("req.files", req.files);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path, 
        filename: f.filename
    }));
    campground.author = req.user.id;
    await campground.save();
    console.log("saved campground:", campground);
    res.send(campground._id);   // send back _id
}));

// router.post('/:id/update', upload.array('images'), isLoggedIn, isAuthor, validateCampground, CatchAsync(async (req, res, next) => {
//     // console.log("req.body:", req.body);
//     console.log("req.body.deleteImages:", req.body.deleteImages);
//     console.log("req.files", req.files);
//     // const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
//     // res.send(campground._id);
// }));

router.post('/:id/update',upload.array('images'), isLoggedIn, isAuthor,validateCampground, CatchAsync(async (req, res, next) => {
    console.log("req.body:", req.body);
    // console.log("req:", req);
    console.log("req.body.deleteImages:", req.body.deleteImages);
    console.log("req.files", req.files);
    const deleteImages = req.body.deleteImages || [];
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => ({
            url: f.path,
            filename: f.filename
        }));
        campground.images.push(...newImages);
    }
    if (deleteImages.length > 0) {
        for (let filename of deleteImages) {
            try {
                await cloudinary.uploader.destroy(filename);
            } catch (err) {
                console.error(`Failed to delete ${filename} from Cloudinary:`, err);
            }
        }
        await campground.updateOne({$pull: {images: {filename: {$in: deleteImages}}}});
    }
    await campground.save();
    console.log("saved campground:", campground);
    res.send(campground._id);
}));

router.delete('/:id/delete', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        res.status(404).send('Campground does not exist!');
    }
    // delete images on cloudinary
    // for (let image of campground.images) {
    //     await cloudinary.uploader.destroy(image.filename);
    // }
   await Campground.findByIdAndDelete(req.params.id);
    res.status(200).send('Campground deleted successfully!');
}));

export default router;