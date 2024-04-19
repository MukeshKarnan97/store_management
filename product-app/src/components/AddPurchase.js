// src/components/AddPurchase.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../style.css';






const generateProductId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/purchases'); // Update URL with your server URL
    const purchases = response.data;
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Count the number of products
    const productCount = purchases.length + 1;

    // Generate the product ID
    const productId = `PRO${dateStr}${productCount.toString().padStart(3, '0')}`;
    
    return productId;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null if there's an error
  }
};

const AddPurchase = ({ }) => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState( 0 );
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const total = price * quantity;
    console.log(productId, productName, price, quantity, total, date);
    try {
        const response = await axios.post('http://localhost:5000/api/purchases', {
          productName,
          productId,
          price,
          quantity,
          total,
          date
        });
        console.log('response.data  -- ', response.data);
      setProductName('');
      setProductId('');
      setPrice(0);
      setQuantity(0);
      setTotal(0);
      setDate(new Date().toISOString().split('T')[0]);
        // Optionally, you can add code to handle success
      } catch (error) {
        console.error('Error adding purchase:', error);
        // Optionally, you can add code to handle errors
      }
    };

    const handleGenerateProductId = async () => {
      const newProductId = await generateProductId();
      if (newProductId) {
        setProductId(newProductId);
      } else {
        // Handle error
      }
    };
    handleGenerateProductId();
    const calculateTotal = () => {
        const calculatedTotal = parseFloat(price) * quantity;
        setTotal(calculatedTotal.toFixed(2));
      };
    
      // Call calculateTotal whenever price or quantity changes
      React.useEffect(() => {
        calculateTotal();
      }, [price, quantity]);



      const [purchases, setPurchases] = useState([]);
useEffect(() => {
  // Fetch data from the server when the component mounts
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchases'); // Update URL with your server URL
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();

  // Clean up function to cancel the effect
  return () => {
    // Optionally, you can cancel any pending requests here
  };
}, []);

  return (
    <><div className="container justod mt-4">
      <div className="d-flex justify-content-center">

        <form onSubmit={handleSubmit} className='form-box'>
          <h1>Add Product</h1>

          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="productId">Product ID </label>
            <input
              type="text"
              id="productId"
              placeholder="Product ID"
              value={productId}
              readOnly
              onChange={(e) => setProductId(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="productId">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="productId">Date</label>
            <input
              type="date"
              placeholder="dd-mm-yyyy"
              value={date}
              onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="quantity">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="total">Total</label>
            <input
              type="number"
              placeholder="Total"
              readOnly
              value={total} />
          </div>
          <input className="btn btn-primary" type="submit" value="Submit" />
        </form>
      </div>
    </div><div className='container-fluid mt-5'>
<h1 className='mb-3 mt-3'>Product List</h1>
    <table className="table table-striped">
  <thead>
    <tr>
            <th>S.No</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
    </tr>
  </thead>
  <tbody>
  {purchases.map((purchase, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{purchase.productId}</td>
              <td>{purchase.productName}</td>
              <td>{purchase.date}</td>
              <td>{purchase.price}</td>
              <td>{purchase.quantity}</td>
              <td>{purchase.total}</td>
            </tr>
          ))}
  </tbody>
</table>

      </div></>
  );
};

export default AddPurchase;
