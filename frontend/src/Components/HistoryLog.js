import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const HistoryLog = ({ data }) => {
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    let cumulativeNewUnits = 0, cumulativeNewTotalPrice = 0, cumulativeUsedUnits = 0, cumulativeUsedTotalPrice = 0, cumulativeCpoUnits = 0, cumulativeCpoTotalPrice = 0;

    // Get the date for 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Log original data to ensure it's being passed correctly
    console.log('Original Data:', data);

    // Sort data based on timestamp in descending order
    const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Log sorted data
    console.log('Sorted Data:', sortedData);

    // Filter data for the last 10 days
    const filteredData = sortedData.filter((log) => new Date(log.timestamp) >= tenDaysAgo);

    // Log filtered data
    console.log('Filtered Data:', filteredData);

    if (filteredData.length === 0) {
      console.log('No data to display.');
    }

    // Process the data for cumulative calculations
    const processedLogs = filteredData.map((log, index) => {
      // Update cumulative totals based on condition
      if (log.condition === 'new') {
        cumulativeNewUnits += 1;
        cumulativeNewTotalPrice += parseFloat(log.price);
      } else if (log.condition === 'used') {
        cumulativeUsedUnits += 1;
        cumulativeUsedTotalPrice += parseFloat(log.price);
      } else if (log.condition === 'cpo') {
        cumulativeCpoUnits += 1;
        cumulativeCpoTotalPrice += parseFloat(log.price);
      }

      return {
        id: index, // Unique identifier for each entry
        date: log.timestamp,
        newUnits: cumulativeNewUnits,
        newTotalPrice: cumulativeNewTotalPrice,
        newAvgMsrp: cumulativeNewUnits > 0 ? cumulativeNewTotalPrice / cumulativeNewUnits : 0,
        usedUnits: cumulativeUsedUnits,
        usedTotalPrice: cumulativeUsedTotalPrice,
        usedAvgMsrp: cumulativeUsedUnits > 0 ? cumulativeUsedTotalPrice / cumulativeUsedUnits : 0,
        cpoUnits: cumulativeCpoUnits,
        cpoTotalPrice: cumulativeCpoTotalPrice,
        cpoAvgMsrp: cumulativeCpoUnits > 0 ? cumulativeCpoTotalPrice / cumulativeCpoUnits : 0,
      };
    });

    setHistoryLogs(processedLogs);
  }, [data]); // Recalculate when the data prop changes

  const columns = [
    { field: 'date', headerName: 'Date', width: 180 },
    { field: 'newUnits', headerName: 'New Inventory', width: 150 },
    { field: 'newTotalPrice', headerName: 'New Total MSRP', width: 180 },
    { field: 'newAvgMsrp', headerName: 'New Avg MSRP', width: 180 },
    { field: 'usedUnits', headerName: 'Used Inventory', width: 150 },
    { field: 'usedTotalPrice', headerName: 'Used Total MSRP', width: 180 },
    { field: 'usedAvgMsrp', headerName: 'Used Avg MSRP', width: 180 },
    { field: 'cpoUnits', headerName: 'CPO Inventory', width: 150 },
    { field: 'cpoTotalPrice', headerName: 'CPO Total MSRP', width: 180 },
    { field: 'cpoAvgMsrp', headerName: 'CPO Avg MSRP', width: 180 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        History Log
      </Typography>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={historyLogs} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default HistoryLog;
