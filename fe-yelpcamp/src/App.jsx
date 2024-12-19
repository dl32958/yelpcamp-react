import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import CampgroundList from './components/Campgrounds/CampgroundList';
import LandingPage from './components/LandingPage/LandingPage';
import Show from './components/Campgrounds/Show';
import New from './components/Campgrounds/New';
import Edit from './components/Campgrounds/Edit';
import Boilerplate from './components/partials/Boilerplate';
import ErrorPage from './components/partials/ErrorPage';
import Login from './components/Users/Login';
import Register from './components/Users/Register';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/partials/ProtectedRoute';

// axios.defaults.withCredentials = true;

function App() {
  // const [currentUser, setCurrentUser] = useState(null);
  // const [checkInProgress, setCheckInProgress] = useState(true);

  // // check if user is logged in
  // useEffect(() => {
  //   const checkLogin = async () => {
  //     setCheckInProgress(true);
  //     const token = sessionStorage.getItem('token');
  //     if (token) {
  //       try {
  //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //         const response = await axios.get('api/users/get-user');
  //         const user = response.data.id
  //         setCurrentUser(user);
  //       } catch (e) {
  //         console.error(e);
  //         sessionStorage.removeItem('token');
  //         setCurrentUser(null);
  //       } finally {
  //         setCheckInProgress(false);
  //       }
  //     } else {
  //       setCheckInProgress(false);
  //       setCurrentUser(null);
  //     }
  //   }
  //   checkLogin();
  // }, []);
  // console.log(currentUser);

  const { currentUser, setCurrentUser, checkInProgress } = useAuth();
  if (checkInProgress) {
    return <h1>Loading...</h1>
  }

  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Boilerplate />}>
            <Route path="/campgrounds" element={<CampgroundList />} />
            <Route path="/campground/:id" element={<Show />} />
            <Route
              path="/campground/:id/edit"
              element={
                <ProtectedRoute>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <New />
                </ProtectedRoute>
              }
            />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  )
}

export default App
