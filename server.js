// server.js
// Express Web Server for Online Food Ordering System

const express = require('express');
const path = require('path');
const { menuItems } = require('./src/menuData.js');
const { createOrderConfirmation } = require('./src/orderCalculator.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Serve static frontend assets (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// 1. Health check endpoint (used by Jenkins Deployment verification)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Online Food Ordering System is live and healthy.'
  });
});

// 2. Menu endpoint - returns all available food items and prices
app.get('/api/menu', (req, res) => {
  res.status(200).json({
    success: true,
    count: menuItems.length,
    items: menuItems
  });
});

// 3. Order processing endpoint - calculates bill and generates confirmation
app.post('/api/order', (req, res) => {
  try {
    const orderData = req.body;
    const confirmation = createOrderConfirmation(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: confirmation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  ONLINE FOOD ORDERING SYSTEM IS RUNNING!         `);
  console.log(`  Access Application at: http://localhost:${PORT}    `);
  console.log(`  Health Check at:       http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

module.exports = { app, server };
