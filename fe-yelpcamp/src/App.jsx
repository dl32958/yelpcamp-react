import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import CampgroundList from './components/Campgrounds/CampgroundList';
import LandingPage from './components/LandingPage';
import Show from './components/Campgrounds/Show';
import New from './components/Campgrounds/New';
import Edit from './components/Campgrounds/Edit';
import Boilerplate from './components/partials/Boilerplate';
import ErrorPage from './components/partials/ErrorPage';
import Login from './components/Users/Login';
import Register from './components/Users/Register';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ProtectedRoute from './components/partials/ProtectedRoute';

// axios.defaults.withCredentials = true;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkInProgress, setCheckInProgress] = useState(true);
  // check if user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      setCheckInProgress(true);
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('api/users/get-user');
          const user = response.data.id
          setCurrentUser(user);
        } catch (e) {
          console.error(e);
          sessionStorage.removeItem('token');
          setCurrentUser(null);
        } finally {
          setCheckInProgress(false);
        }
      } else {
        setCheckInProgress(false);
        setCurrentUser(null);
      }
    }
    checkLogin();
  }, []);
  console.log(currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Boilerplate user={currentUser} setUser={setCurrentUser}/>}>
          <Route path="/campgrounds" element={<CampgroundList />} />
          <Route path="/campground/:id" element={<Show user={currentUser}/>} />
          <Route 
            path="/campground/:id/edit" 
            element={
              <ProtectedRoute user={currentUser} checkInProgress={checkInProgress}>
                <Edit />
              </ProtectedRoute>
              } 
          />
          <Route 
            path="/new" 
            element={
              <ProtectedRoute user={currentUser} checkInProgress={checkInProgress}>
                <New />
              </ProtectedRoute>
            }
          />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
