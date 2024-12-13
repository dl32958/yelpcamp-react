import React from 'react'
import { useNavigate } from 'react-router'

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className='row'>
            <div className="col-6 offset-3">
                <h4 className='alert alert-danger' role='alert'>Sorry, something went wrong.</h4>
                <button className='btn btn-warning mx-auto d-block' onClick={() => navigate(-1)}>
                    Go back
                </button>
            </div>
        </div>
    )
}

export default ErrorPage