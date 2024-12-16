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

const Edit = () => {
    const navigate = useNavigate();
    const [campground, setCampground] = useState(undefined);
    const { id } = useParams();   // campground id

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
                setCampground(campgroundData);

                setValue('title', campgroundData.title);
                setValue('location', campgroundData.location);
                setValue('image', campgroundData.image);
                setValue('price', campgroundData.price);
                setValue('description', campgroundData.description);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCampground();
    }, []);

    const onFormSubmit = async (data) => {
        const campground = { ...data };
        try {
            const response = await axios.post(`/api/campgrounds/${id}/update`, { campground });
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
                <div className='mb-3'>
                    <label className='form-label' htmlFor="image">Image</label>
                    <input
                        className={getClassName(errors.image)}
                        type="text"
                        id="image"
                        name='image'
                        {...register("image")}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
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
                    <div className="card-body mt-3">
                        <button className='btn btn-success me-2' disabled={!isValid}>Submit</button>
                        <a
                            href={`/campground/${id}`}
                            className='card-link btn btn-secondary'
                        >
                            Cancel
                        </a>
                    </div>
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
                        <EditForm />
                    </div>
                </div>
            ) : (null)}
        </>
    )
}

export default Edit