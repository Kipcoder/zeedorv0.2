import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;