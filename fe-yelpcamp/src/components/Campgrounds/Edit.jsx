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
            location: e.target[1].value
        }
        // console.log(id)
        const response = await axios.post(`/api/campgrounds/${id}/update`, campground);
        // console.log(response.data)
        navigate(`/campground/${response.data}`);
    }

    return (
        <>
            <h1>Add Campground</h1>
            <form onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" defaultValue={campground ? campground.title : ""} />
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" name="location" defaultValue={campground ? campground.location : ""} />
                </div>
                <button>Submit</button>
            </form>
            <a href="/campgrounds">All Campgrounds</a>
        </>
    )
}

export default Edit