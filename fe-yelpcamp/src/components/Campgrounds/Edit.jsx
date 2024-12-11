import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
    const navigate = useNavigate();
    const [campground, setCampground] = useState(undefined);
    const { id } = useParams();   // campground id

    useEffect(() => {
        const fetchCampground = async () => {
            const response = await axios.get(`/api/campgrounds/${id}`);
            setCampground(response.data.campground);
        };
        fetchCampground();
    }, []);

    const onFormSubmit = async (e) => {
        e.preventDefault()
        const campground = {
            title: e.target[0].value,
            location: e.target[1].value,
            image: e.target[2].value,
            price: e.target[3].value,
            description: e.target[4].value,
        }
        // console.log(id)
        try {
            const response = await axios.post(`/api/campgrounds/${id}/update`, campground);
            if (response.status === 200) {
                navigate(`/campground/${response.data}`);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            {campground ? (
            <div className='row'>
                <h1 className='text-center'>Edit Campground</h1>
                <div className="col-6 offset-3">
                    <form onSubmit={onFormSubmit}>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="title">Title</label>
                            <input className='form-control' type="text" id="title" name="title" defaultValue={campground ? campground.title : ""} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="location">Location</label>
                            <input className='form-control' type="text" id="location" name="location" defaultValue={campground ? campground.location : ""} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="image">Image</label>
                            <input className='form-control' type="text" id="image" name="image" defaultValue={campground ? campground.image : ""} />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="price">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input className='form-control' type="text" id="price" name="price" defaultValue={campground ? campground.price : ""} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="description">Description</label>
                            <textarea className='form-control' type="text" id="description" name="description" defaultValue={campground ? campground.description : ""} />
                        </div>
                        <div className='mb-3'>
                            <button className='btn btn-success me-2'>Update</button>
                        </div>
                    </form>
                </div>
            </div>
            ) : (null)}
        </>
    )
}

export default Edit