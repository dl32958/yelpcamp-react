import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ user, checkInProgress, children }) => {
    const location = useLocation();

    if (checkInProgress) {
        return <div>Loading...</div>;
    }
    if (!user) {
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