import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesView = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sales'); // Update URL with your server URL
        setSales(response.data);
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
    <div className='container-fluid mt-5'>
    <h1 className='mb-5'>Sales List</h1>
        <table className="table table-striped">
      <thead>
        <tr>
                <th>S.No</th>
                <th>Product ID</th>
                <th>Sales ID</th>
                <th>Product Name</th>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
        </tr>
      </thead>
      <tbody>
      {sales.map((sales, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{sales.productId}</td>
                  <td>{sales.salesId}</td>
                  <td>{sales.productName}</td>
                  <td>{sales.date}</td>
                  <td>{sales.price}</td>
                  <td>{sales.quantity}</td>
                  <td>{sales.total}</td>
                </tr>
              ))}
      </tbody>
    </table>
    
          </div>
  );
};

export default SalesView;
