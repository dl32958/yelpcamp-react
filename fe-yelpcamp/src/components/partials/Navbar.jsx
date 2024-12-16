import React from 'react';
import axios from 'axios';
import { showToast } from '../../utils/showToast';

const Navbar = (props) => {
    const onLogoutClick = () => {
        sessionStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
        showToast('success', 'Logout successful!');
    };
    // console.log(props);
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
                        {props.user ? (
                            <a href="#" className="nav-link" onClick={onLogoutClick}>
                                Logout
                            </a>
                        ) : (
                            <>
                                <a className="nav-link" href="/login">
                                    Login
                                </a>
                                <a className="nav-link" href="/register">
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