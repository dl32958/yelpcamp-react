import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';

const CampgroundList = () => {
    const [campgrounds, setCampgrounds] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchCampgrounds = async () => {
            try {
                const response = await axios.get('/api/campgrounds');
                console.log(response);
                setCampgrounds(response.data.campgrounds);
            } catch (e) {
                console.error(e);
            }
        };
        fetchCampgrounds();
        if (location?.state?.showToast) {
            const { type, message } = location.state.showToast;
            // console.log(type, message);
            showToast(type, message);
        }
    }, []);

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ul>
                <h1>All Campgrounds</h1>
                {campgrounds.length ? (
                    campgrounds.map((campground, index) => (
                        <div className="card mb-3 shadow" key={index}>
                            <div className='row'>
                                <div className="col-md-4">
                                    <img src={campground.images[0].url} alt="" className="img-fluid" />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className='card-title'>{campground.title}</h5>
                                        <p className='card-text'>{campground.description}</p>
                                        <p className='card-text'>
                                            <small className="text-muted">
                                                {campground.location}
                                            </small>
                                        </p>
                                        <a href={`/campground/${campground._id}`} className='btn btn-primary'>Read More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <h2>No data</h2>
                )}
            </ul>
        </div>
    )
}

export default CampgroundList