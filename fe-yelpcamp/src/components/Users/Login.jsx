import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/Validation';
import { getClassName } from '../../utils/GetClassName';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/showToast';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import loginPic from "../../assets/login_pic.jpg";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.state?.from ?? '/campgrounds';
    console.log("location", location);
    console.log("path:", path);

    const { setCurrentUser } = useAuth();

    useEffect(() => {
        if (location?.state?.showToast) {
            const { type, message } = location.state.showToast;
            showToast(type, message);
        }
    }, []);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onBlur",
    });

    console.log(errors);

    const onFormSubmit = async (data) => {
        console.log(data);
        const payload = { user: { ...data } };    // { user: { email: '...', password: '...' } }
        console.log(payload);
        try {
            const response = await axios.post('/api/users/login', payload);
            if (response.status === 200) {
                const { token } = response.data;
                // console.log(token);
                sessionStorage.setItem('token', token);
                const user = jwtDecode(token);
                // console.log(user);
                setCurrentUser(user);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                navigate(path, {
                    state: {
                        showToast: {
                            type: 'success',
                            message: 'Login successful!',
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

    const LoginForm = () => {
        return (
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className='mb-3'>
                    <label className='form-label' htmlFor="email">Email</label>
                    <input
                        className={getClassName(errors.email)}
                        type="email"
                        id="email"
                        autoFocus
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
                <div className="mb-3">
                    <button className='btn btn-success mb-1 w-100' disabled={!isValid}>Login</button>
                    <button
                        className='btn btn-secondary w-100'
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
            <div className="container justify-content-center align-items-center mt-1">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                        <div className="card shadow">
                            <img src={loginPic} alt="" className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">Login</h5>
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login