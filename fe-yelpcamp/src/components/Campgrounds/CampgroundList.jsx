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
            <h1>Campground List</h1>
            <ul>
                {campgrounds.map((campground, index) => (
                    <li key={index}>{campground.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default CampgroundList