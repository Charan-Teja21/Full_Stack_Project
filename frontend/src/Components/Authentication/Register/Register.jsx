import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa';  // Import an icon for visual appeal
import './Register.css';

function UserRegister() {
const { register, handleSubmit, formState: { errors } } = useForm();
const navigate = useNavigate();
const [err, setErr] = useState('');

async function handleFormSubmit(newUser) {
    try {
    const res = await axios.post('http://localhost:3500/user', newUser);
    if (res.data.message === "User Created") {
        toast.success('Registration Successful! Please login.', {
        position: "top-right",
        autoClose: 3000,
        });
        navigate('/login');
    } else {
        setErr(res.data.message);
    }
    } catch (error) {
    setErr('An error occurred during registration. Please try again later.');
    }
}

useEffect(() => {
    if (err) {
    toast.error(err, {
        position: "top-center",
        autoClose: 3000,
    });
    }
}, [err]);

return (
    <div className='container Register'>
    <div className='d-flex justify-content-center align-items-center'>
        <form className='mx-auto p-5 mt-5 shadow-lg rounded Form' onSubmit={handleSubmit(handleFormSubmit)}>
        <h1 className='text-center mb-4'>REGISTER</h1>
        <div className='w-100 text-start mb-3'>
            <label htmlFor="firstname" className="form-label">First Name</label>
            <input 
            type="text" 
            className={`form-control ${errors.firstname ? 'is-invalid' : ''}`} 
            {...register('firstname', { required: true, minLength: 4 })} 
            />
            {errors.firstname?.type === 'required' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> First Name is required!
            </p>
            )}
            {errors.firstname?.type === 'minLength' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Minimum length is 4 characters.
            </p>
            )}
        </div>

        <div className='w-100 text-start mb-3'>
            <label htmlFor="lastname" className="form-label">Last Name</label>
            <input 
            type="text" 
            className={`form-control ${errors.lastname ? 'is-invalid' : ''}`} 
            {...register('lastname', { required: true, minLength: 4 })} 
            />
            {errors.lastname?.type === 'required' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Last Name is required!
            </p>
            )}
            {errors.lastname?.type === 'minLength' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Minimum length is 4 characters.
            </p>
            )}
        </div>

        <div className='w-100 text-start mb-3'>
            <label htmlFor="username" className="form-label">User Name</label>
            <input 
            type="text" 
            className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
            {...register('username', { required: true, minLength: 4 })} 
            />
            {errors.username?.type === 'required' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> User Name is required!
            </p>
            )}
            {errors.username?.type === 'minLength' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Minimum length is 4 characters.
            </p>
            )}
        </div>

        <div className='w-100 text-start mb-3'>
            <label htmlFor="password" className="form-label">Password</label>
            <input 
            type="password" 
            className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
            {...register('password', { required: true, minLength: 5 })} 
            />
            {errors.password?.type === 'required' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Password is required!
            </p>
            )}
            {errors.password?.type === 'minLength' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Minimum length is 5 characters.
            </p>
            )}
        </div>

        <div className='w-100 text-start mb-4'>
            <label htmlFor="email" className="form-label">Email</label>
            <input 
            type="email" 
            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
            {...register('email', { required: true })} 
            />
            {errors.email?.type === 'required' && (
            <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Email is required!
            </p>
            )}
        </div>

        <button className="btn d-block bn mt-4 w-100 btn-primary">REGISTER</button>
        </form>
    </div>
    <p className="text-center lead mt-3">
        Already Registered? <Link to='/login' className="text-primary fw-bold">Login</Link>
    </p>
    </div>
);
}

export default UserRegister;
