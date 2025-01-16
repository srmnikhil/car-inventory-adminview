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
    inventoryData.push(row);
  })
  .on('end', () => {
    // Sort the inventory data by timestamp in ascending order
    inventoryData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });

// API endpoint

app.get('/api/inventory', (req, res) => {
  const { type, make, duration } = req.query;

  let filteredData = inventoryData;

  // Filter by vehicle type
  if (type) filteredData = filteredData.filter(item => item.type === type);

  // Filter by vehicle make
  if (make) filteredData = filteredData.filter(item => item.make === make);

  // Filter by duration
  if (duration) {
    const now = new Date();
    let startDate;
    if (duration === 'last_month') startDate = new Date(now.setMonth(now.getMonth() - 1));
    else if (duration === 'last_3_months') startDate = new Date(now.setMonth(now.getMonth() - 3));
    else if (duration === 'last_6_months') startDate = new Date(now.setMonth(now.getMonth() - 6));
    else if (duration === 'this_year') startDate = new Date(now.getFullYear(), 0, 1);

    if (startDate) {
      filteredData = filteredData.filter(item => new Date(item.date) >= startDate);
    }
  }

  // Remove " USD" from the price field
  filteredData = filteredData.map(item => ({
    ...item,
    price: item.price.replace(' USD', '') // Removing " USD" from price
  }));
  filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(filteredData);
});

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
