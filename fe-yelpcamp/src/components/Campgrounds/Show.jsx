import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const show = () => {
  const [campground, setCampground] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampground = async () => {
      const response = await axios.get(`/api/campgrounds/${id}`);
      console.log(response.data);
      setCampground(response.data.campground);
    };
    fetchCampground();
  }, [id]);

  const handleDeleteClick = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}`);
    if (response.status === 200) {
      navigate('/campgrounds');
    }
  };

  return (
    <>
      {campground ? (
        <div>
          <h1>{campground.title}</h1>
          <h3>{campground.location}</h3>
        </div>
      ) : (
        <h1>No data</h1>
      )}
      <a href={`/campground/${id}/edit`}>Edit This Campground</a>
      <br />
      <button onClick={handleDeleteClick}>Delete Campground</button>
      <br />
      <a href="/campgrounds">All Campgrounds</a>
    </>
  )
}

export default show