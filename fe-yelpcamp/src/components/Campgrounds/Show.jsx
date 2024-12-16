import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { reviewSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';

const show = () => {
  const [campground, setCampground] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchCampground = async () => {
    const response = await axios.get(`/api/campgrounds/${id}`);
    console.log(response.data);
    setCampground(response.data.campground);
  };

  useEffect(() => {
    fetchCampground();
  }, []);

  const handleDeleteClick = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}/delete`);
    if (response.status === 200) {
      navigate('/campgrounds');
    }
  };

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    resolver: yupResolver(reviewSchema),
    mode: "onBlur",
    defaultValues: {
      rating: 3,
      // body: 'Leave your review here'
    }
  });

  const onReviewSubmit = async (data) => {
    const playload = { review: { ...data } };
    // console.log(playload);
    const response = await axios.post(`/api/campgrounds/${id}/reviews`, playload);
    if (response.status === 200) {
      // console.log(response.data);
      fetchCampground();
      reset();
    }
  };
  const handleReviewDelete = async (reviewId) => {
    const response = await axios.delete(`/api/campgrounds/${id}/reviews/${reviewId}`);
    if (response.status === 200) {
      fetchCampground();
    }
  };

  const ReviewList = () => {
    if (!campground || campground.reviews.length === 0) {
      return <p className='text-muted'>No reviews available.</p>;
    }

    return (
      <>
        {campground.reviews.map((review, index) => (
          <div key={index} className="card mb-2">
            <div className="card-body">
              <h6 className="card-title">Rating: {review.rating}</h6>
              <p className="card-text">{review.body}</p>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleReviewDelete(review._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </>
    );
  };

  const ReviewForm = () => {
    return (
      <>
        <h2>Leave Your Review</h2>
        <form onSubmit={handleSubmit(onReviewSubmit)} className='mb-3'>
          <div className='mb-3'>
            <label className='form-label' htmlFor="rating">Rating</label>
            <input
              className={getClassName(errors.rating, 'form-range')}
              type="range"
              id="rating"
              {...register("rating")}
              min={1}
              max={5}
            />
            {errors.rating && <div className="invalid-feedback">{errors.rating.message}</div>}
          </div>
          <div className="mb-3">
            <label className='form-label' htmlFor="body">Review</label>
            <textarea
              className={getClassName(errors.body)}
              type="text"
              id="body"
              name='body'
              {...register("body")}
              cols="30"
              rows="5"
              placeholder="Leave your review here"
            />
            {errors.body && <div className="invalid-feedback">{errors.body.message}</div>}
          </div>
          <div>
            <button className='btn btn-success' disabled={!isValid}>Add Review</button>
          </div>
        </form>
      </>
    )
  };

  return (
    <>
      {campground ? (
        <>
          <div className="row">
            <div className="col-6">
              <div className="card mb-3">
                <img src={campground.image} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{campground.title}</h5>
                  <p className="card-text">{campground.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item text-muted">{campground.location}</li>
                  <li className="list-group-item">${campground.price} / day </li>
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
            <div className="col-6">
              <ReviewForm />
              <ReviewList />
            </div>
          </div>
        </>
      ) : (
        <h1>Sorry, this campground doesn't exist.</h1>
      )}
    </>
  )
}

export default show