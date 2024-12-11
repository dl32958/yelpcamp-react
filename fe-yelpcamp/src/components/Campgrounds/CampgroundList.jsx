import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampgroundList = () => {
    const [campgrounds, setCampgrounds] = useState([]);
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
    }, []);

    return (
        <div>
            <ul>
                <h1>All Campgrounds</h1>
                {campgrounds.length ? (
                    campgrounds.map((campground, index) => (
                        <div className="card mb-3" key={index}>
                            <div className='row'>
                                <div className="col-md-4">
                                    <img src={campground.image} alt="" className="img-fluid" />
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