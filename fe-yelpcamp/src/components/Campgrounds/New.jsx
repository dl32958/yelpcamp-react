import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { campgroundSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';

const New = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(campgroundSchema),
        mode: "onBlur",
    });

    const onFormSubmit = async (data) => {
        try {
            const playload = { campground: { ...data } };
            const response = await axios.post('/api/campgrounds/new', playload);
            if (response.status === 200) {
                navigate(`/campground/${response.data}`);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (e) {
            console.error('Error occurred while posting data:', e);
        }
    }

    const NewForm = () => {
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
                </div>
                <div className="card-body mt-3">
                    <button className='btn btn-success me-2' disabled={!isValid}>Submit</button>
                    <a
                        href="/campgrounds"
                        className='card-link btn btn-secondary'
                    >
                        Cancel
                    </a>
                </div>
            </form>
        )
    }

    return (
        <>
            <div className='row'>
                <h1 className='text-center'>Add Campground</h1>
                <div className="col-6 offset-3">
                    <NewForm />
                </div>
            </div>
        </>
    )
}

export default New