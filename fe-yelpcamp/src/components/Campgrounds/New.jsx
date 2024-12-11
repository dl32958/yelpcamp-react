import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const New = () => {
    const navigate = useNavigate();
    const onFormSubmit = async (e) => {
        e.preventDefault()
        // console.log(e)
        const campground = {
            title: e.target[0].value,
            location: e.target[1].value,
            image: e.target[2].value,
            price: e.target[3].value,
            description: e.target[4].value,
        }
        // console.log(campground)
        try {
            const response = await axios.post('/api/campgrounds/new', campground);
            if (response.status === 200) {
                navigate(`/campground/${response.data}`);
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (e) {
            console.error('Error occurred while posting data:', e);
        }
        // console.log(response.data)
    }

    return (
        <>
            <div className='row'>
                <h1 className='text-center'>Add Campground</h1>
                <div className="col-6 offset-3">
                    <form onSubmit={onFormSubmit}>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="title">Title</label>
                            <input className='form-control' type="text" id="title" name="title" />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="location">Location</label>
                            <input className='form-control' type="text" id="location" name="location" />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="image">Image</label>
                            <input className='form-control' type="text" id="image" name="image" />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="price">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input className='form-control' type="text" id="price" name="price" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="description">Description</label>
                            <textarea className='form-control' type="text" id="description" name="description" />
                        </div>
                        <div className='card-body'>
                            <button className='btn btn-success me-2'>Submit</button>
                            <a
                                href="/campgrounds"
                                className='card-link btn btn-secondary'
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default New