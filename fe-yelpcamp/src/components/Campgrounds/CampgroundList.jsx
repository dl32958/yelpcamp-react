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
            <h1>All Campgrounds</h1>
            <a href="/new">Add New Campground</a>
            <ul>
                {campgrounds.length? (
                    campgrounds.map((campground, index) => (
                        <li key={index}>
                            <a href={`/campground/${campground._id}`}>{campground.title}</a>
                        </li>
                    ))
                ) : (
                    <h2>No data</h2>
                )}
            </ul>
        </div>
    )
}

export default CampgroundList