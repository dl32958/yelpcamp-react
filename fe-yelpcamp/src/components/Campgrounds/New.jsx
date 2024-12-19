import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { campgroundSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';

const New = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fileNames, setFileNames] = useState([]);
    const [fileObjects, setFileObjects] = useState([]);

    useEffect(() => {
        if (location?.state?.showToast) {
            const { type, message } = location.state.showToast;
            showToast(type, message);
        }
    }, [location]);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(campgroundSchema),
        mode: "onBlur",
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files);

        const newFiles = files.filter(
            (file) => !fileNames.includes(file.name)
        )
        console.log("new file:", newFiles);

        setFileNames((prev) => [...prev, ...newFiles.map((file) => file.name)]);
        setFileObjects((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setFileObjects((prev) => prev.filter((_, i) => i !== index));
        setFileNames((prev) => prev.filter((_, i) => i !== index));
    };

    const onFormSubmit = async (data) => {
        console.log(data);
        console.log(fileObjects);
        if (fileObjects.length === 0) {
            showToast('error', 'Please select at least one image');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('campground[title]', data.title);
            formData.append('campground[location]', data.location);
            formData.append('campground[price]', data.price);
            formData.append('campground[description]', data.description);
            fileObjects.forEach((file) => {
                formData.append("images", file);
            });
            const response = await axios.post('/api/campgrounds/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            if (response.status === 200) {
                navigate(`/campground/${response.data}`, {
                    replace: true,
                    state: {
                        showToast: {
                            type: 'success',
                            message: 'Campground added successfully!',
                        }
                    }
                });
            } else {
                console.error('Unexpected status code:', response.status);
            }
        } catch (e) {
            const mainError = JSON.parse(JSON.stringify(e));
            const response = JSON.parse(JSON.stringify(e.response));
            navigate('/error', { state: { mainError, response } });
        }
    }

    const NewForm = () => {
        return (
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="title">Title</label>
                    <input
                        className={getClassName(errors.title)}
                        type="text"
                        id="title"
                        name='title'
                        {...register("title")}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="location">Location</label>
                    <input
                        className={getClassName(errors.location)}
                        type="text"
                        id="location"
                        {...register("location")}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Images</label>
                    <div className="input-group">
                        <label
                            htmlFor="images"
                            className="input-group-text btn btn-secondary"
                            style={{ cursor: 'pointer' }}
                        >
                            Choose Files
                        </label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder={fileNames.length > 0 ? fileNames[fileNames.length - 1] : "No files selected"}
                            readOnly
                        />
                    </div>
                    {fileNames.length > 0 ? (
                        <div className="mt-2">
                            {/* <h6>Selected Files:</h6> */}
                            <ul
                            style={{paddingLeft: '0', listStyleType: "disc"}}
                            >
                                {fileNames.map((fileName, index) => (
                                    <li key={index} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span style={{ marginRight: "8px", color: "black" }}>•</span>
                                            <span>{fileName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger px-1 py-0 border-start"
                                            onClick={() => removeFile(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-2 text-muted">No files selected</div>
                    )}
                </div>

                <div className='mb-3'>
                    <label className='form-label' htmlFor="price">Price</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            className={getClassName(errors.price)}
                            type="text"
                            id="price"
                            name='price'
                            {...register("price")}
                        />
                    </div>
                    {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </div>
                <div className="mb-3">
                    <label className='form-label' htmlFor="description">Description</label>
                    <textarea
                        className={getClassName(errors.description)}
                        type="text"
                        id="description"
                        name='description'
                        {...register("description")}
                        rows="5"
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>
                <div className="mb-3">
                    <button className='btn btn-success w-100 mb-1' disabled={!isValid}>Submit</button>
                    <a
                        href="/campgrounds"
                        className='card-link btn btn-secondary w-100'
                    >
                        Cancel
                    </a>
                </div>
            </form>
        )
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='row'>
                <h1 className='text-center'>New Campground</h1>
                <div class="col-md-6 offset-md-3">
                    <div className="card shadow">
                        <div className="card-body">
                        <NewForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default New