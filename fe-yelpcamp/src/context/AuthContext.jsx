import axios from 'axios';
import React, {createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [checkInProgress, setCheckInProgress] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get('/api/users/get-user');
                    console.log("user response.data: ",response.data);
                    const user = response.data.user;
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
    console.log("currentUser: ",currentUser);

    return (
        <AuthContext.Provider value={{currentUser, setCurrentUser, checkInProgress}}>
            {children}
        </AuthContext.Provider>
    )

};