import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Payment.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Payment() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.useruserLoginReducer);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement actual payment processing here
    // For now, we simulate a successful payment
    try {
      let res = await axios.put(`/paymentSuccess/${currentUser.username}`, {});
      //console.log(res);
      if (res.data.message==='Payment Successful!') {
        toast.success('Payment Successful!'); // Replace alert with toast
        navigate('/userdashboard');
      } else {
        toast.error('Payment failed, please try again!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment. Please try again later.');
    }
  };

  return (
    <div className="Payment container mt-4 mb-4">
      <h1 className="text-center pb-3 display-1"><b>Payment</b></h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="mb-3">
          <label htmlFor="cardNumber" className="form-label">Card Number</label>
          <input
            type="text"
            className="form-control"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input
            type="text"
            className="form-control"
            id="expiryDate"
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">CVV</label>
          <input
            type="text"
            className="form-control"
            id="cvv"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cardholderName" className="form-label">Cardholder Name</label>
          <input
            type="text"
            className="form-control"
            id="cardholderName"
            name="cardholderName"
            value={paymentDetails.cardholderName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;