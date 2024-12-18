import React, { useEffect } from 'react';
import { showToast } from '../../utils/showToast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogoutClick = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = null;
        setCurrentUser(null);
        navigate(location.pathname || '/', {
            state: {
                showToast: {
                    type: 'success',
                    message: 'Logout successful!'
                }
            }
        });
    };
    console.log("currentUser: ", currentUser);
    
    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark py-3">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">YelpCamp</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active" aria-current="page" href="/">
                            Home
                        </a>
                        <a className="nav-link" href="/campgrounds">
                            Campgrounds
                        </a>
                        <a className="nav-link" href="/new">
                            New Campground
                        </a>
                    </div>
                    <div className="navbar-nav ms-auto">
                        {currentUser ? (
                            <a className="nav-link" href="#" onClick={onLogoutClick}>
                                Logout
                            </a>
                        ) : (
                            <>
                                {/* navigate back to the previous page */}
                                <a className="nav-link" href="/login" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login', {
                                        state: {
                                            from: location.pathname,
                                        }
                                    });
                                }}>
                                    Login
                                </a>
                                <a className="nav-link" href="/register" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register', {
                                        state: {
                                            from: location.pathname,
                                        }
                                    });
                                }}>
                                    Register
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar