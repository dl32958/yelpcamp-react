import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, checkInProgress } = useAuth();
    const location = useLocation();

    if (checkInProgress) {
        return <div>Loading...</div>;
    }
    if (!currentUser) {
        return (
            <Navigate
                to="/login"
                replace
                state={{from: location.pathname}}    
            />
        )
    }
  return children
}

export default ProtectedRoute;