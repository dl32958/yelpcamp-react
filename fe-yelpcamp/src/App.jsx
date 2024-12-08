import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import CampgroundList from './components/Campgrounds/CampgroundList';
import LandingPage from './components/LandingPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/campgrounds" element={<CampgroundList />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
