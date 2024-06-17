import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Cart.css';
import CartImage from '../../Images/Cart.webp'

function Cart() {
  let [items, setItems] = useState([]);
  let { currentUser } = useSelector(state => state.useruserLoginReducer);
  let navigate = useNavigate();

  async function getCartItems() {
    let res = await axios.get(`http://localhost:5000/cart/${currentUser.username}`);
    setItems(res.data.payload);
  }

  async function handleQuantityChange(title, quantity) {
    let res = await axios.put(`http://localhost:5000/quantity/${currentUser.username}`, { title, quantity });
    if (res.data.success) {
      setItems(items.map(item => item.title === title ? { ...item, quantity } : item));
    }
  }

  async function handleDelete(title) {
    let res = await axios.put(`/deleteproduct/${currentUser.username}`, { title });
    if (res.data.success) {
      setItems(items.filter(item => item.title !== title));
    }
  }

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(()=>{
    getCartItems();
  },[handleDelete,handleQuantityChange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.cost * item.quantity, 0);
  };

  const handlePayment = () => {
    // Implement the payment logic here
    alert('Proceeding to payment...');
    // Navigate to the payment page or trigger payment process
    navigate('/payment');
  };

  return (
    <div className='Cart container'>
        {items?.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <img className='img22' src={CartImage} alt="" />
        </div>
        ) : (
        <>
          <h1 className='text-center pb-3 display-1'><b>CART</b></h1>
          {items.map((obj, index) => (
            <div key={index} className='row d-flex align-items-center justify-content-between col m-3 rounded shadow-lg'>
              <div className="p-2 col-sm-12 col-md-4 d-flex align-items-center justify-content-center">
                <img src={obj.image} className='img11' alt="" />
              </div>
              <div className='p-2 col-sm-12 col-md-8'>
                <h3 className='text-center'>{obj.title}</h3>
                <div className="row d-flex">
                  <div className="col-6">
                    <h5 className='text-center'>Cost: {formatCurrency(obj.cost)}</h5>
                  </div>
                  <div className='col-3'>
                    <select
                      value={obj.quantity}
                      onChange={(e) => handleQuantityChange(obj.title, e.target.value)}
                      className="form-select mb-2"
                    >
                      {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-3 text-center">
                    <button className="btn rounded bg-primary" onClick={() => handleDelete(obj.title)}>Delete</button>
                  </div>
                </div>
                <div className="text-center">
                  <h5>Total: {formatCurrency(obj.cost * obj.quantity)}</h5>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center m-4">
            <h3>Total Amount: {formatCurrency(calculateTotal())}</h3>
            <button className="btn btn-success mt-2" onClick={handlePayment}>Proceed to Payment</button>
          </div>
        </>
        )}
    </div>
  );
}

export default Cart;
