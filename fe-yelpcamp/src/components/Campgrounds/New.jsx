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
            location: e.target[1].value
        }
        // console.log(campground)
        const response = await axios.post('/api/campgrounds/new', campground);
        // console.log(response.data)
        navigate(`/campground/${response.data}`);
    }

  return (
    <>
        <h1>Add Campground</h1>
        <form onSubmit={onFormSubmit}>
            <div>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" />
            </div>
            <div>
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" />
            </div>
            <button>Submit</button>
        </form>
        <a href="/campgrounds">All Campgrounds</a>
    </>
  )
}

export default New