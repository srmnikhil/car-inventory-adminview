import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../redux/slices/inventorySlice';
import Navbar from '../Components/Navbar';
import Inventory from '../Components/Inventory';
import InventoryCountChart from '../Components/InventoryCountChart';
import AverageMSRPChart from '../Components/AverageMSRPChart';
import HistoryLog from '../Components/HistoryLog';
const Dashboard = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.inventory);

    useEffect(() => {
        dispatch(fetchInventory());  // Dispatch the fetchInventory action
    }, [dispatch]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <Navbar />
            <div style={{ backgroundColor: "#F5F5F5", padding: "1rem" }}>
                <Inventory data={data} />
                <InventoryCountChart data={data}/>
                <AverageMSRPChart data={data}/>
                <HistoryLog data={data}/>
            </div>
        </>
    )
}

export default Dashboard
