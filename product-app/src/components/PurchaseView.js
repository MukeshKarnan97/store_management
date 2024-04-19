import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PurchaseView = () => {
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
    <div className='container-fluid mt-5'>
    <h1 className='mb-5'>Product List</h1>
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
    
          </div>
  );
};

export default PurchaseView;
