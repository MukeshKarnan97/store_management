import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConsolitatedData = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product_details'); // Update URL with your server URL
        console.log(response.data);
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
                <th>Sales ID</th>
                <th>Product Name</th>
                <th>Purchase Date</th>
                <th>Sold Date</th>
                <th>Available Quantity</th>
                <th>Price</th>
                <th>Sold Quantity</th>
                <th>Total</th>
        </tr>
      </thead>
      <tbody>
      {purchases.map((purchase, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{purchase.productId}</td>
                  <td>{purchase.salesId}</td>
                  <td>{purchase.productName}</td>
                  <td>{purchase.purchase_date}</td>
                  <td>{purchase.sold_date}</td>
                  <td>{purchase.available_quantity}</td>
                  <td>{purchase.purchase_price}</td>
                  <td>{purchase.sold_quantity}</td>
                  <td>{purchase.total_price}</td>
                </tr>
              ))}
      </tbody>
    </table>
    
          </div>
  );
};

export default ConsolitatedData;
