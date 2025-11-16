import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const TransactionStatusChart: React.FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const COLORS = ['#10B981', '#EF4444', '#F59E0B']; // Green, Red, Yellow for Approved, Fraudulent, In Review

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#FFF' }}/>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const FraudByLocationChart: React.FC<{ data: { location: string, count: number }[] }> = ({ data }) => {
    return (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top 5 Fraudulent Locations</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="location" />
                    <YAxis allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#FFF' }} />
                    <Legend />
                    <Bar dataKey="count" fill="#EF4444" name="Fraudulent Transactions" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AdminDashboard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const stats = useMemo(() => {
        const total = transactions.length;
        const fraudulent = transactions.filter(t => t.status === 'fraudulent').length;
        const approved = transactions.filter(t => t.status === 'approved').length;
        const inReview = transactions.filter(t => t.status === 'in_review').length;
        const fraudRate = total > 0 ? ((fraudulent / total) * 100).toFixed(1) : '0.0';

        const fraudulentByLocation = transactions
            .filter(t => t.status === 'fraudulent')
            .reduce((acc, t) => {
                acc[t.location] = (acc[t.location] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
        
        const chartDataLocation = Object.entries(fraudulentByLocation)
            .map(([location, count]) => ({ location, count }))
            .sort((a,b) => b.count - a.count)
            .slice(0, 5);

        return {
            total,
            fraudulent,
            approved,
            inReview,
            fraudRate,
            pieChartData: [
                { name: 'Approved', value: approved },
                { name: 'Fraudulent', value: fraudulent },
                { name: 'In Review', value: inReview },
            ].filter(item => item.value > 0), // Filter out empty slices
            locationChartData: chartDataLocation,
        };
    }, [transactions]);
    
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Administrator Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Transactions" value={stats.total.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>} />
                <StatCard title="Fraudulent" value={stats.fraudulent.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Approved" value={stats.approved.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Fraud Rate" value={`${stats.fraudRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionStatusChart data={stats.pieChartData} />
                <FraudByLocationChart data={stats.locationChartData} />
            </div>
        </div>
    );
};

export default AdminDashboard;
