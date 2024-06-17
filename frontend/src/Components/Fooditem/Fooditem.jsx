import './Fooditem.css';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaRegStarHalfStroke } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Fooditem() {
    let { state } = useLocation();
    let { currentUser, loginUserStatus } = useSelector(state1 => state1.useruserLoginReducer);
    const [showDropdown, setShowDropdown] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, content: '' });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const fetchReviews = async () => {
        try {
            let res = await axios.get(`http://localhost:5000/reviews/${state.title}`);
            setReviews(res.data.payload);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [state.title, reviewSubmitted]);

    const handleAddToCartClick = () => {
        setShowDropdown(true);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    async function handleSubmitQuantity() {
        obj1.title = state.title;
        obj1.quantity = Number(quantity);
        obj1.image = state.image;
        obj1.cost = state.cost;
        try {
            let res = await axios.put(`http://localhost:5000/cart/${currentUser.username}`, obj1);
            alert('Successfully added to cart!');
            console.log(res.data.message);
            console.log(currentUser);
            setShowDropdown(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleStarClick = (index) => {
        setNewReview({ ...newReview, rating: index });
    };

    const handleReviewChange = (event) => {
        setNewReview({ ...newReview, content: event.target.value });
    };

    async function handleReviewSubmit() {
        newReview.username = currentUser.username;
        try {
            await axios.put(`http://localhost:5000/reviews/${state.title}`, newReview);
            alert('Review submitted successfully!');
            setReviewSubmitted(!reviewSubmitted);  // Toggle the reviewSubmitted state
            setNewReview({ rating: 0, content: '' });
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className='FoodItem container pt-2 pb-2'>
            <div className="row">
                <div className="col-sm-12 d-flex col-md-6 p-2 align-items-center justify-content-center">
                    <img src={state.image} style={{ width: "90%" }} alt="" />
                </div>
                <div className="col-sm-12 col-md-6 pt-3">
                    <h1 className="text-center display-1" style={{ fontSize: "2.5rem", fontWeight: "bolder" }}>{state.title.toUpperCase()}</h1>
                    <div className="d-flex align-items-center">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStarHalfStroke />
                      <span style={{width:'15px'}}></span>
                      {state.rating}
                      </div>
                    <div className='row mt-2 text-center'>
                        <div className='col-6'>
                            <p className='display-6' style={{ borderRight: "1px solid black" }}>{state.foodType.toUpperCase()}</p>
                            <p>Food Type</p>
                        </div>
                        <div className='col-6'>
                            <p className='display-6'>{state.restaurant.toUpperCase()}</p>
                            <p>Restaurant</p>
                        </div>
                    </div>
                    <div className='mt-3 text-center'>
                        <h3 className='display-6'>Cost: ₹{state.cost}</h3>
                        {
                            (loginUserStatus === true) &&
                            <>
                                <button className='btn btn-primary mt-2' onClick={handleAddToCartClick}>
                                    Add to Cart
                                </button>
                                {showDropdown && (
                                    <div className="mt-2 row">
                                        <div className="col-6">
                                            <select value={quantity} onChange={handleQuantityChange} className="form-select mb-2">
                                                {[...Array(10).keys()].map(num => (
                                                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <button className='btn btn-success' onClick={handleSubmitQuantity}>
                                                Submit Quantity
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className='w-100'>
                <h2 className='pt-2'>DESCRIPTION</h2>
                <p style={{ textAlign: 'justify' }}>{state.description}</p>
            </div>
            <div className='w-100'>
                <h2 className='pt-2'>REVIEWS</h2>
                <div>
                    {Array.isArray(reviews) && reviews.map((review, index) => (
                        <div key={index} className='mb-2 d-flex gap-4'>
                            <div>
                                {[...Array(review.rating)].map((star, i) => (
                                    <FaStar key={i} color='gold' />
                                ))}
                                {[...Array(5 - review.rating)].map((star, i) => (
                                    <FaStar key={i} color='lightgrey' />
                                ))}
                            </div>
                            <p>{review.content}</p>
                            <p><strong>{review.username}</strong></p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p>No reviews available</p>}
                </div>
                {loginUserStatus === true ? (
                    <div className='mt-3'>
                        <h3>Leave a Review</h3>
                        <div>
                            {[...Array(5)].map((star, index) => (
                                <FaStar
                                    key={index}
                                    color={index < newReview.rating ? 'gold' : 'lightgrey'}
                                    onClick={() => handleStarClick(index + 1)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                        <textarea
                            className='form-control mt-2'
                            rows='3'
                            value={newReview.content}
                            onChange={handleReviewChange}
                            placeholder='Write your review here...'
                        ></textarea>
                        <button className='btn btn-primary mt-2' onClick={handleReviewSubmit}>
                            Submit Review
                        </button>
                    </div>
                ) : (
                    <p className='fs-1 text-center pb-2 '><b>Please log in to leave a review.</b></p>
                )}
            </div>
        </div>
    );
}

export default Fooditem;
