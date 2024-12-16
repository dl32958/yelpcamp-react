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
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Boilerplate />}>
          <Route path="/campgrounds" element={<CampgroundList />} />
          <Route path="/campground/:id" element={<Show />} />
          <Route path="/campground/:id/edit" element={<Edit />} />
          <Route path="/new" element={<New />} />
          <Route path="/error" element={<ErrorPage />} />
        </Route>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
