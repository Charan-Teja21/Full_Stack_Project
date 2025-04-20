import './Fooditem.css';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FaRegStarHalfStroke } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

// Ensure you call toast.configure() somewhere in your app, usually in App.js
//toast.configure();

function Fooditem() {
    //let { state } = useLocation();
    const location = useLocation();
    const currentPath = location.pathname; // This gives you the current path
    const id = currentPath.split("/")[2];
    //console.log(currentPath.split("/")[2])
    let { currentUser, loginUserStatus } = useSelector(state1 => state1.useruserLoginReducer);
    const [showDropdown, setShowDropdown] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, content: '' });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [state, setState]=useState({})

    const [loading, setLoading] = useState(true);

    const fetchFood = async () => {
        setLoading(true);
        try {
            let res = await axios.get(`http://localhost:3500/foodite/${id}`);
            console.log('API Response:', res.data.payload);
            setState(res.data.payload);
            if (res.data.payload.title) {
                fetchReviews(res.data.payload.title);
            }
        } catch (error) {
            console.error('Error fetching food item:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (title) => {
        try {
            let res = await axios.get(`http://localhost:3500/reviews/${title}`);
            setReviews(res.data.payload);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // ✅ Always call hooks at the top level, never conditionally
    useEffect(() => {
        console.log('Updated state:', state);
    }, [state]);

    useEffect(() => {
        fetchFood();
    }, [id]);

    useEffect(() => {
        if (state.title) {
            fetchReviews(state.title); // ✅ pass title explicitly
        }
    }, [state.title, reviewSubmitted]);

    // ✅ Now it's safe to do conditional rendering
    if (loading) {
        return <p>Loading...</p>;
    }

    const handleAddToCartClick = () => {
        setShowDropdown(true);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    async function handleSubmitQuantity() {
        let obj1 = {
            title: state.title,
            quantity: Number(quantity),
            image: state.image,
            cost: state.cost,
        };

        try {
            let res = await axios.put(`http://localhost:3500/cart/${currentUser.username}`, obj1);
            toast.success('Successfully added to cart!'); // Replace alert with toast
            setShowDropdown(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Error adding to cart. Please try again.'); // Error handling
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
            await axios.put(`http://localhost:3500/reviews/${state.title}`, newReview);
            toast.success('Review submitted successfully!'); // Replace alert with toast
            setReviewSubmitted(!reviewSubmitted);  // Toggle the reviewSubmitted state
            setNewReview({ rating: 0, content: '' });
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review. Please try again.'); // Error handling
        }
    };

    return (
        <div className='FoodItem container pt-2 pb-2'>
            <div className="row">
                <div className="col-sm-12 d-flex col-md-6 p-2 align-items-center justify-content-center">
                    <img src={state?.image} style={{ width: "90%" }} alt="" />
                </div>
                <div className="col-sm-12 col-md-6 pt-3">
                    <h1 className="text-center display-1" style={{ fontSize: "2.5rem", fontWeight: "bolder" }}>{state?.title?.toUpperCase()}</h1>
                    <div className="d-flex align-items-center">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaRegStarHalfStroke />
                        <span style={{ width: '15px' }}></span>
                        {state?.rating}
                    </div>
                    <div className='row mt-2 text-center'>
                        <div className='col-6'>
                            <p className='display-6' style={{ borderRight: "1px solid black" }}>{state?.foodType?.toUpperCase()}</p>
                            <p>Food Type</p>
                        </div>
                        <div className='col-6'>
                            <p className='display-6'>{state?.restaurant.toUpperCase()}</p>
                            <p>Restaurant</p>
                        </div>
                    </div>
                    <div className='mt-3 text-center'>
                        <h3 className='display-6'>Cost: ₹{state?.cost}</h3>
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
                <p style={{ textAlign: 'justify' }}>{state?.description}</p>
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
        // <div>
        //     HI
        // </div>
    );
}

export default Fooditem;
