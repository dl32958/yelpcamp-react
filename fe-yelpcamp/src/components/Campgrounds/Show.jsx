import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { reviewSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';
import { useAuth } from '../../context/AuthContext';
import ReactStars from "react-rating-stars-component";

const show = () => {
  const [campground, setCampground] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, checkInProgress } = useAuth();

  const fetchCampground = async () => {
    const response = await axios.get(`/api/campgrounds/${id}`);
    console.log(response.data);
    setCampground(response.data.campground);
  };

  useEffect(() => {
    fetchCampground();
    if (location?.state?.showToast) {
      const { type, message } = location.state.showToast;
      console.log(type, message);
      showToast(type, message);
    }
  }, []);

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(`/api/campgrounds/${id}/delete`);
      if (response.status === 200) {
        navigate('/campgrounds', {
          state: {
            showToast: {
              type: 'success',
              message: 'Campground deleted successfully!'
            }
          }
        });
      }
    } catch (e) {
      const mainError = JSON.parse(JSON.stringify(e));
      const response = JSON.parse(JSON.stringify(e.response));
      navigate('/error', { state: { mainError, response } });
    }
  };

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = useForm({
    resolver: yupResolver(reviewSchema),
    mode: "onBlur",
    defaultValues: {
      rating: 3,
      // body: 'Leave your review here'
    }
  });

  const rating = watch("rating");

  const ratingChanged = (newRating) => {
    setValue("rating", newRating);
  };

  const onReviewSubmit = async (data) => {
    const playload = { review: { ...data } };
    // console.log(playload);
    try {
      const response = await axios.post(`/api/campgrounds/${id}/reviews`, playload);
      if (response.status === 200) {
        // console.log(response.data);
        fetchCampground();
        reset();
        console.log("response.data", response.data);
        showToast('success', response.data ?? 'Review added successfully!');
      }
    } catch (e) {
      showToast('error', e.response.data ?? 'Something went wrong');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await axios.delete(`/api/campgrounds/${id}/reviews/${reviewId}`);
      if (response.status === 200) {
        fetchCampground();
        showToast('success', response.data ?? 'Review deleted successfully!');
      }
    } catch (e) {
      showToast('error', e.response.data ?? 'Something went wrong');
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
              {currentUser && currentUser?.id === review.author?._id && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReviewDelete(review._id)}
                >
                  Delete
                </button>
              )}
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
            <ReactStars
              count={5}
              value={rating}
              onChange={ratingChanged}
              size={30}
              activeColor="#ffd700"
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
        theme="light"
      />
      {campground ? (
        <>
          <div className="row">
            <div className="col-6">
              <div className="card mb-3">
                {/* <img src={campground.image} className="card-img-top" alt="..." /> */}
                {/* display images */}
                <div id="campgroundcarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {campground.images.map((img, idx) => (
                      <div key={idx} className={"carousel-item" + (idx === 0 ? " active" : "")}>
                        <img src={img.url} className="d-block w-100" alt="" />
                      </div>
                    ))}
                  </div>
                  {campground.images.length > 1 ? (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#campgroundcarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#campgroundcarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  ) : null}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{campground.title}</h5>
                  <p className="card-text">{campground.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item text-muted">{campground.location}</li>
                  <li className="list-group-item">${campground.price} / day </li>
                </ul>
                <div className="card-body">
                  {currentUser && currentUser?.id === campground?.author?._id && (
                    <>
                      <a
                        className="card-link btn btn-info me-2"
                        href={`/campground/${id}/edit`}
                      >
                        Edit
                      </a>
                      <button className="btn btn-danger" onClick={handleDeleteClick}>
                        Delete
                      </button>
                    </>
                  )}
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