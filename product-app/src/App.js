// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Routes instead of Route
import AddPurchase from './components/AddPurchase';
import PurchaseView from './components/PurchaseView';
import 'bootstrap/dist/css/bootstrap.min.css';
import SalePage from './components/SellProduct';
import SalesView from './components/SalesView';
import ConsolitatedData from './components/ConsolitatedData';
import IndexPage from './components/IndexPage';




function App() {

  return (
    <Router>
      <>
      <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Store Management</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product_add">Add Product</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product_view">View Product</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sale_page">Sale</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/view_sales">Sale View</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/consolitated_data">Product Log</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </>
      <Routes>
        <Route path="/" element={<IndexPage/>} />
        <Route path="/product_add" element={<AddPurchase/>} />
        <Route path="/product_view" element={<PurchaseView />} />
        <Route path="/sale_page" element={<SalePage/>} />
        <Route path="/view_sales" element={<SalesView/>} />
        <Route path="/consolitated_data" element={<ConsolitatedData/>} />
      </Routes>
    </Router>
  );
}

export default App;
