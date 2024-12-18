import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

const Boilerplate = () => {
  return (
    <div className='d-flex flex-column vh-100'>
        <Navbar/>
        <main className="container mt-5">
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Boilerplate;