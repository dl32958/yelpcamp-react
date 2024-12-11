import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import CampgroundList from './components/Campgrounds/CampgroundList';
import LandingPage from './components/LandingPage';
import Show from './components/Campgrounds/Show';
import New from './components/Campgrounds/New';
import Edit from './components/Campgrounds/Edit';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/campgrounds" element={<CampgroundList />} />
        <Route path="/campground/:id" element={<Show />} />
        <Route path="/campground/:id/edit" element={<Edit />} />
        <Route path="/new" element={<New />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
