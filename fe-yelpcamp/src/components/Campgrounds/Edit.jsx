import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { campgroundSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';
import { useAuth } from '../../context/AuthContext';

const Edit = () => {
    const { currentUser, checkInProgress } = useAuth();
    const [campground, setCampground] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();   // campground id
    // console.log(currentUser, checkInProgress);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [initialImages, setInitialImages] = useState([]);

    // setValue hook is used to set the value of the input field
    const { register, handleSubmit, formState: { errors, isValid }, setValue } = useForm({
        resolver: yupResolver(campgroundSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const fetchCampground = async () => {
            try {
                const response = await axios.get(`/api/campgrounds/${id}`);
                const campgroundData = response.data.campground;
                console.log("campgroundData:", campgroundData);
                setCampground(campgroundData);
                console.log(campground);

                const initialImageFilenames = campgroundData.images.map((image) => image.filename);
                setExistingImages(initialImageFilenames); // ['image1.jpg', 'image2.jpg'] maintain this array for displaying the image name list
                setInitialImages(initialImageFilenames);
                setValue('title', campgroundData.title);
                setValue('location', campgroundData.location);
                // setValue('image', campgroundData.image);
                setValue('price', campgroundData.price);
                setValue('description', campgroundData.description);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCampground();
    }, []);

    useEffect(() => {
        if (!checkInProgress && currentUser && campground) {
            if (currentUser.id !== campground.author._id.toString()) {
                navigate(`/campground/${id}`, {
                    state: {
                        showToast: {
                            type: 'error',
                            message: 'You are not the author of this campground!',
                        }
                    }
                });
            };
        }
    }, [campground, currentUser, checkInProgress]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("upload files", files);

        setNewImages((prev) => [...prev, ...files]);
        setExistingImages((prev) => [...prev, ...files.map((file) => file.name)]);
        e.target.value = null;
    };
    const removeExistingImage = (filename) => {
        if (initialImages.includes(filename)) {
            setDeletedImages((prev) => [...prev, filename]);
        }
        setExistingImages((prev) => prev.filter((image) => image !== filename));
        setNewImages((prev) => prev.filter((file) => file.name !== filename));
    };

    const onFormSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('campground[title]', data.title);
            formData.append('campground[location]', data.location);
            formData.append('campground[price]', data.price);
            formData.append('campground[description]', data.description);

            newImages.forEach((file) => {
                formData.append('images', file);
            });
            deletedImages.forEach((image) => {
                formData.append('deleteImages[]', image);
            });

            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.post(`/api/campgrounds/${id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (response.status === 200) {
                navigate(`/campground/${response.data}`, {
                    state: {
                        showToast: {
                            type: 'success',
                            message: 'Campground updated successfully!',
                        }
                    }
                });
            }
        } catch (e) {
            const mainError = JSON.parse(JSON.stringify(e));
            const response = JSON.parse(JSON.stringify(e.response));
            // if front-end validation not work, back-end validation will catch it, and redirect to a error page
            navigate('/error', { state: { mainError, response } });
        }
    }

    const EditForm = () => {
        return (
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="title">Title</label>
                    <input
                        className={getClassName(errors.title)}
                        type="text"
                        id="title"
                        name='title'
                        {...register("title")}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="location">Location</label>
                    <input
                        className={getClassName(errors.location)}
                        type="text"
                        id="location"
                        {...register("location")}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                </div>
                {/* Images */}
                <div className='mb-3'>
                    <label className='form-label'>Images</label>
                    <div className="input-group">
                        <label
                            htmlFor="images"
                            className="input-group-text btn btn-secondary"
                            style={{ cursor: 'pointer' }}
                        >
                            Choose Files
                        </label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder={existingImages.length > 0 ? existingImages[existingImages.length - 1] : "No files selected"}
                            readOnly
                        />
                    </div>
                    {existingImages.length > 0 ? (
                        <div className="mt-2">
                            {/* <h6>Selected Files:</h6> */}
                            <ul
                                style={{ paddingLeft: '0', listStyleType: "disc" }}
                            >
                                {existingImages.map((fileName, index) => (
                                    <li key={index} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span style={{ marginRight: "8px", color: "black" }}>•</span>
                                            <span>{fileName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger px-1 py-0 border-start me-2"
                                            onClick={() => removeExistingImage(fileName)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-2 text-muted">No files selected</div>
                    )}
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="price">Price</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            className={getClassName(errors.price)}
                            type="text"
                            id="price"
                            name='price'
                            {...register("price")}
                        />
                    </div>
                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </div>
                <div className="mb-3">
                    <label className='form-label' htmlFor="description">Description</label>
                    <textarea
                        className={getClassName(errors.description)}
                        type="text"
                        id="description"
                        name='description'
                        {...register("description")}
                        rows="5"
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>
                <div className="mb-3">
                    <button className='btn btn-success w-100 mb-1' disabled={!isValid}>Submit</button>
                    <a
                        href={`/campground/${id}`}
                        className='card-link btn btn-secondary w-100'
                    >
                        Cancel
                    </a>
                </div>
            </form>
        )
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {campground ? (
                <div className='row'>
                    <h1 className='text-center'>Edit Campground</h1>
                    <div className="col-6 offset-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <EditForm />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (null)}
        </>
    )
}

export default Edit