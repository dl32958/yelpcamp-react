import React from 'react'
import { useAuth } from '../../context/AuthContext'
import "./LandingPage.css";

const LandingPage = () => {
  const { currentUser, setCurrentUser } = useAuth();

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

  return (
    <div className="d-flex vh-100 text-center text-white bg-dark" id="virtualBody">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">YelpCamp</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a href="/" aria-current="page" className="nav-link active home">
                Home
              </a>
              <a href="/campgrounds" className="nav-link home">
                Campgrounds
              </a>
              {!currentUser ? (
                <>
                  <a href="/login" aria-current="page" className="nav-link home">
                    Login
                  </a>
                  <a href="/register" aria-current="page" className="nav-link home">
                    Register
                  </a>
                </>
              ) : (
                <a href="#" aria-current="page" onClick={onLogoutClick} className="nav-link home">
                  Logout
                </a>
              )}
            </nav>
          </div>
        </header>
        <main className="px-3">
          <h1 className='mb-3'>YelpCamp</h1>
          <p className="lead mb-3">
            Welcome to YelpCamp! 
            <br />
            Join us to discover, review, and share your favorite camping spots with like-minded adventurers.
          </p>
          <a href="/campgrounds" className="btn btn-lg btn-light bg-white">
            View Campgrounds
          </a>
        </main>
        <footer className="mt-auto text-sm-center text-secondary">&copy; YelpCamp 2024</footer>
      </div>
    </div>
  )
}

export default LandingPage