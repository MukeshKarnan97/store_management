import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';





const generateSalesId = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/sales'); // Update URL with your server URL
    const purchases = response.data;
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Count the number of products
    const productCount = purchases.length + 1;

    // Generate the product ID
    const productId = `SAL${dateStr}${productCount.toString().padStart(3, '0')}`;
    
    return productId;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null if there's an error
  }
};
const SellProduct = ({ }) => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchases, setPurchases] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [itemSelected, setItemSelected] = useState(false); // Track if an item is selected
  const [salesId, setSalesId] = useState('');
  const [fetchedQuantity, setFetchedQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/purchases');
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenerateSalesId = async () => {
    const newProductId = await generateSalesId();
    if (newProductId) {
      setSalesId(newProductId);
    } else {
      // Handle error
    }
  };
  handleGenerateSalesId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity > fetchedQuantity) {
      alert('Quantity exceeds available stock!');
      return;
    }
    console.log(productId, productName, price, quantity, total, date);
    try {
      const response = await axios.post('http://localhost:5000/api/sales', {
        salesId,
        productId,
        productName,
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
      setItemSelected(false); // Reset itemSelected state
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const calculateTotal = () => {
    const calculatedTotal = parseFloat(price) * quantity;
    setTotal(calculatedTotal.toFixed(2));
  };

  React.useEffect(() => {
    calculateTotal();
  }, [price, quantity]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchInput(searchValue);

    const filteredResults = purchases.filter(
      (purchase) =>
        purchase.productId.toLowerCase().includes(searchValue) ||
        purchase.productName.toLowerCase().includes(searchValue)
    );
    setSearchResults(filteredResults);
  };

  const handleProductSelect = (selectedProduct) => {
    setProductId(selectedProduct.productId);
    setProductName(selectedProduct.productName);
    setPrice(selectedProduct.price);
    setItemSelected(true); // Set itemSelected to true when item is selected
    setFetchedQuantity(selectedProduct.quantity);
  };

  const searchResultsJSX = searchResults.map((result) => (
    <div key={result.productId} onClick={() => handleProductSelect(result)}>
      {result.productId} - {result.productName} - {result.price}
    </div>
  ));

  return (
    <div className="container justod mt-4">
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} className='form-box'>
          <h1>Sell Product</h1>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="salesId">Sales ID </label>
            <input
              type="text"
              id="salesId"
              readOnly
              placeholder="Sales ID"
              value={salesId}
              onChange={(e) => setSalesId(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="searchInput">Search Product</label>
            <input
              type="text"
              placeholder="Enter Product ID or Name"
              value={searchInput}
              onChange={handleSearch}
            />
          </div>
          {itemSelected ? null : searchResultsJSX} {/* Conditionally render search results */}
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="productId">Product ID </label>
            <input
              type="text"
              id="productId"
              readOnly
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="productName">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              readOnly
              value={productName}
              onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="date">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <label className="L-weight" htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              readOnly
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
    </div>
  );
};

export default SellProduct;
