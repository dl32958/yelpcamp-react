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
  }, []);

  const handleDeleteClick = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}`);
    if (response.status === 200) {
      navigate('/campgrounds');
    }
  };

  return (
    <>
      {campground ? (
        <>
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card mb-3">
                <img src={campground.image} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{campground.title}</h5>
                  <p className="card-text">{campground.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item text-muted">{campground.location}</li>
                  <li className="list-group-item">${campground.price} / month </li>
                </ul>
                <div className="card-body">
                  <a
                    className="card-link btn btn-info me-2"
                    href={`/campground/${id}/edit`}
                  >
                    Edit
                  </a>
                  <button className="btn btn-danger" onClick={handleDeleteClick}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1>No data</h1>
      )}
    </>
  )
}

export default show