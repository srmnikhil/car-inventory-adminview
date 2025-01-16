const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
app.use(cors());

let inventoryData = [];

// Load CSV data
fs.createReadStream('sample-data.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    // Parse the timestamp into a Date object
    row.timestamp = new Date(row.timestamp);
    inventoryData.push(row);
  })
  .on('end', () => {
    // Sort the inventory data by timestamp in ascending order
    inventoryData.sort((a, b) => a.timestamp - b.timestamp);
  });

// API endpoint
app.get('/api/inventory', (req, res) => {
  const { type, make, duration } = req.query;

  let filteredData = inventoryData;

  // Filter by vehicle type
  if (type) filteredData = filteredData.filter(item => item.product_type === type);

  // Filter by vehicle make
  if (make) filteredData = filteredData.filter(item => item.brand === make);

  // Filter by duration
  if (duration) {
    const now = new Date();
    let startDate;
    
    if (duration === 'last_month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Last month
    }
    else if (duration === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
    }
    else if (duration === 'last_3_months') {
      startDate = new Date(now.setMonth(now.getMonth() - 3)); // Last 3 months
    }
    else if (duration === 'last_6_months') {
      startDate = new Date(now.setMonth(now.getMonth() - 6)); // Last 6 months
    }
    else if (duration === 'this_year') {
      startDate = new Date(now.getFullYear(), 0, 1); // Start of this year
    }
    else if (duration === 'last_year') {
      startDate = new Date(now.getFullYear() - 1, 0, 1); // Start of last year
    }

    if (startDate) {
      filteredData = filteredData.filter(item => item.timestamp >= startDate);
    }
  }

  // Remove " USD" from the price field
  filteredData = filteredData.map(item => ({
    ...item,
    price: item.price.replace(' USD', '') // Removing " USD" from price
  }));

  filteredData.sort((a, b) => a.timestamp - b.timestamp);

  res.json(filteredData);
});

// Start server
app.listen(5000, () => console.log('Server running.'));
