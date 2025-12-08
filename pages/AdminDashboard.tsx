import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';


const StatCard: React.FC<{ title: string; value: string; subtitle?: string; icon: React.ReactNode; color: string }> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: color }}>
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                {icon}
            </div>
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
        
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        const fraudulentAmount = transactions.filter(t => t.status === 'fraudulent').reduce((sum, t) => sum + t.amount, 0);
        const inReviewAmount = transactions.filter(t => t.status === 'in_review').reduce((sum, t) => sum + t.amount, 0);

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

        // High-risk merchants
        const merchantRisk = transactions.reduce((acc, t) => {
            if (!acc[t.merchant]) {
                acc[t.merchant] = { total: 0, fraudulent: 0, amount: 0 };
            }
            acc[t.merchant].total++;
            acc[t.merchant].amount += t.amount;
            if (t.status === 'fraudulent') {
                acc[t.merchant].fraudulent++;
            }
            return acc;
        }, {} as Record<string, { total: number; fraudulent: number; amount: number }>);

        const highRiskMerchants = Object.entries(merchantRisk)
            .map(([merchant, data]) => ({
                merchant,
                fraudRate: data.total > 0 ? ((data.fraudulent / data.total) * 100).toFixed(0) : '0',
                totalTransactions: data.total,
                totalAmount: data.amount
            }))
            .filter(m => parseInt(m.fraudRate) > 0)
            .sort((a, b) => parseInt(b.fraudRate) - parseInt(a.fraudRate))
            .slice(0, 5);

        return {
            total,
            fraudulent,
            approved,
            inReview,
            fraudRate,
            totalAmount,
            fraudulentAmount,
            inReviewAmount,
            pieChartData: [
                { name: 'Approved', value: approved },
                { name: 'Fraudulent', value: fraudulent },
                { name: 'In Review', value: inReview },
            ].filter(item => item.value > 0),
            locationChartData: chartDataLocation,
            highRiskMerchants
        };
    }, [transactions]);
    
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Administrator Overview</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Transactions" 
                    value={stats.total.toString()} 
                    subtitle={`$${stats.totalAmount.toFixed(2)} total value`}
                    color="#6366F1"
                    icon={<svg className="h-6 w-6" style={{ color: '#6366F1' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} 
                />
                <StatCard 
                    title="Fraudulent" 
                    value={stats.fraudulent.toString()} 
                    subtitle={`$${stats.fraudulentAmount.toFixed(2)} blocked`}
                    color="#EF4444"
                    icon={<svg className="h-6 w-6" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} 
                />
                <StatCard 
                    title="Approved" 
                    value={stats.approved.toString()} 
                    subtitle="Verified legitimate"
                    color="#10B981"
                    icon={<svg className="h-6 w-6" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                />
                <StatCard 
                    title="Pending Review" 
                    value={stats.inReview.toString()} 
                    subtitle={`$${stats.inReviewAmount.toFixed(2)} awaiting`}
                    color="#F59E0B"
                    icon={<svg className="h-6 w-6" style={{ color: '#F59E0B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                />
            </div>

            {/* Key Metric Banner */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-red-100">System Fraud Rate</p>
                        <p className="text-4xl font-bold mt-1">{stats.fraudRate}%</p>
                        <p className="text-sm text-red-100 mt-1">{stats.fraudulent} fraudulent out of {stats.total} total transactions</p>
                    </div>
                    <svg className="h-16 w-16 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionStatusChart data={stats.pieChartData} />
                <FraudByLocationChart data={stats.locationChartData} />
            </div>

            {/* High-Risk Merchants Table */}
            {stats.highRiskMerchants.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        High-Risk Merchants
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Merchant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fraud Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {stats.highRiskMerchants.map((merchant, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{merchant.merchant}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                {merchant.fraudRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{merchant.totalTransactions}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${merchant.totalAmount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
