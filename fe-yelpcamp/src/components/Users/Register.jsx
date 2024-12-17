import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.state?.from ?? '/campgrounds';
    console.log(path);
    const { setCurrentUser } = useAuth();

    useEffect(() => {
        if (location?.state?.showToast) {
            const { type, message } = location.state.showToast;
            showToast(type, message);
        }
    }, []);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
    });

    const onFormSubmit = async (data) => {
        // console.log(data);
        const payload = { user: { ...data } };    // { user: { email: '...', password: '...' } }
        // console.log(payload);
        try {
            const response = await axios.post('/api/users/register', payload);
            if (response.status === 200) {
                const {token} = response.data;
                sessionStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const user = jwtDecode(token);
                setCurrentUser(user);
                navigate(path, {
                    state: {
                        showToast: {
                            type: 'success',
                            message: 'Register successful!',
                        }
                    }
                });
            }
        } catch (e) {
            if (e.response?.status === 409) {
                showToast('error', e.response.data?.message || e.response.data);
            } else {
                const mainError = JSON.parse(JSON.stringify(e));
                const response = JSON.parse(JSON.stringify(e.response));
                navigate('/error', { state: { ...mainError, ...response } });
            }
        }
    };

    const RegisterForm = () => {
        return (
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="email">Email</label>
                    <input
                        className={getClassName(errors.email)}
                        type="email"
                        id="email"
                        {...register('email')}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="password">Password</label>
                    <input
                        className={getClassName(errors.password)}
                        type="password"
                        id="password"
                        {...register('password')}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className={getClassName(errors.confirmPassword)}
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
                <div className="card-body mt-3">
                    <button className='btn btn-success me-2' disabled={!isValid}>Register</button>
                    <button
                        className='btn btn-secondary'
                        onClick={() => navigate(path)}
                    >
                        Cancel
                    </button>
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
                <h1 className="text-center">Register</h1>
                <div className="col-6 offset-md-3">
                    {RegisterForm()}
                </div>
            </div>
        </>
    )
}

export default Register