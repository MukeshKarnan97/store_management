// server/server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// SQLite database connection
const db = new sqlite3.Database('./database/purchases.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Create the purchases table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY,
    productName TEXT,
    productId TEXT,
    price REAL,
    quantity INTEGER,
    total REAL,
    date TEXT -- Add date column here
  )`);
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY,
    productId TEXT,
    salesId TEXT,
    productName TEXT,
    price REAL,
    quantity INTEGER,
    total REAL,
    date TEXT -- Add date column here
  )`);
});
// db.serialize(() => {
//   db.run(`ALTER TABLE purchases ADD COLUMN date TEXT`);
// });

// db.serialize(() => {
//   db.run(`DELETE FROM purchases`);
// });
// db.serialize(() => {
//   db.run(`DELETE FROM sales`);
// });

// Handle POST requests to /api/purchases
app.post('/api/purchases/', (req, res) => {
    const { productName, productId, price, quantity, total, date } = req.body;
    // const currentDate = new Date().toISOString();
    // Insert data into the purchases table
    const sql = `INSERT INTO purchases (productName, productId, price, quantity, total, date) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [productName, productId, price, quantity, total, date], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error inserting data into database' });
        }
        // Data inserted successfully
        res.status(200).json({ message: 'Data inserted successfully' });
    });
});
  
  app.get('/api/purchases/', (req, res) => {
    const sql = `SELECT * FROM purchases`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });


//   app.post('/api/sales/', (req, res) => {
//     const { salesId, productId, productName, price, quantity, total, date } = req.body;
//     // const currentDate = new Date().toISOString();
//     // Insert data into the purchases table
//     const sql = `INSERT INTO sales ( salesId, productId, productName, price, quantity, total, date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     db.run(sql, [salesId, productId, productName, price, quantity, total, date], function(err) {
//         if (err) {
//             return res.status(500).json({ error: 'Error inserting data into database' });
//         }
//         // Data inserted successfully
//         res.status(200).json({ message: 'Data inserted successfully' });
//     });
// });


app.post('/api/sales/', (req, res) => {
  const { salesId, productId, productName, price, quantity, total, date } = req.body;
  // Insert data into the sales table
  const salesSql = `INSERT INTO sales (salesId, productId, productName, price, quantity, total, date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(salesSql, [salesId, productId, productName, price, quantity, total, date], function(err) {
      if (err) {
          return res.status(500).json({ error: 'Error inserting data into sales table' });
      }
      // Update the quantity in the purchases table
      // const updatePurchaseSql = `UPDATE purchases SET quantity = quantity - ?, total = (SELECT price * (quantity - ?) FROM products WHERE productId = ?) WHERE productId = ?`;
      const updatePurchaseSql = `
                        UPDATE purchases 
                        SET quantity = quantity - ?,
                        total = price * quantity
                        WHERE productId = ?`;
      db.run(updatePurchaseSql, [quantity, productId], function(err) {
          if (err) {
              return res.status(500).json({ error: 'Error updating quantity in purchases table' });
          }
          const updatePurchaseSql = `
                        UPDATE purchases 
                        SET total = price * quantity
                        WHERE productId = ?`;
      db.run(updatePurchaseSql, [productId], function(err) {
          if (err) {
              return res.status(500).json({ error: 'Error updating quantity in purchases table' });
          }
        });
          
          // Data inserted into sales table and quantity updated in purchases table successfully
          res.status(200).json({ message: 'Data inserted into sales table and quantity updated in purchases table successfully' });
      });
      
  });
});


app.get('/api/sales/', (req, res) => {
  const sql = `SELECT * FROM sales`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


app.get('/api/product_details/', (req, res) => {
  const sql = `SELECT 
  s.productId,
  s.salesId,
  s.productName,
  s.quantity AS sold_quantity,
  COALESCE(p.available_quantity, 0) AS available_quantity,
  p.price AS purchase_price,
  s.date AS sold_date,
  p.date As purchase_date,
  p.total AS total_price
FROM 
  sales s
LEFT JOIN 
  (
      SELECT 
          productId,
          SUM(quantity) AS available_quantity,
          price,
          SUM(quantity * price) AS total,
          date
      FROM 
          purchases
      GROUP BY 
          productId
  ) p ON s.productId = p.productId;`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});