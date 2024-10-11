import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginThunk, resetState } from '../../../redux/slices/userSlice'; // Use resetState instead of resetLoginState
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa';

function Login() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  let { loginUserStatus, errorOccurred, errMsg } = useSelector(state => state.useruserLoginReducer);
  let dispatch = useDispatch();
  let { register, handleSubmit, formState: { errors } } = useForm();
  let navigate = useNavigate();

  useEffect(() => {
    // Use resetState to clear any stale login data on component mount
    dispatch(resetState());
  }, [dispatch]);

  function handleFormSubmit(userObj) {
    setFormSubmitted(true);
    dispatch(userLoginThunk(userObj));
  }

  useEffect(() => {
    if (formSubmitted) {
      if (loginUserStatus === true) {
        toast.success('Login Successful!', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/userdashboard');
      } else if (errorOccurred && errMsg) {
        if (errMsg === "User does not exist") {
          toast.error('User does not exist!', {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (errMsg === "Invalid Password") {
          toast.error('Invalid Password!', {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error(errMsg, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
    }
  }, [loginUserStatus, errorOccurred, errMsg, navigate, formSubmitted]);

  return (
    <div className='container lg'>
      <div className='d-flex justify-content-center align-items-center'>
        <form className='mx-auto p-5 mt-5 Form shadow-lg rounded' onSubmit={handleSubmit(handleFormSubmit)}>
          <h1 className='text-center mb-4'>LOGIN</h1>
          <div className='w-100 text-start mb-3'>
            <label htmlFor="Username" className="form-label">User Name</label>
            <input 
              type="text" 
              id="Username" 
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
              type='password' 
              id="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              {...register('password', { required: true, minLength: 4 })} 
            />
            {errors.password?.type === 'required' && (
              <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Password is required!
              </p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-danger mt-2">
                <FaExclamationCircle className="me-1" /> Minimum length is 4 characters.
              </p>
            )}
          </div>
          <button className="btn d-block bn mt-4 w-100 btn-primary">LOGIN</button>
        </form>
      </div>
      <p className="text-center lead mt-3">
        Not yet Registered? <Link to='/register' className="text-primary fw-bold">Register</Link>
      </p>
    </div>
  );
}

export default Login;
