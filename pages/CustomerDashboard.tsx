import React, { useState } from 'react';
import { Transaction } from '../types';

interface CustomerDashboardProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'status' | 'reason' | 'timestamp'>) => void;
    isLoading: boolean;
    error: string | null;
    lastTransaction: Transaction | undefined;
}

const TransactionForm: React.FC<{
    onSubmit: (data: { amount: number; merchant: string; location: string }) => void;
    isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !merchant || !location) {
            alert("Please fill all fields.");
            return;
        }
        onSubmit({ amount: parseFloat(amount), merchant, location });
        setAmount('');
        setMerchant('');
        setLocation('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., 49.99" required min="0.01" step="0.01" />
            </div>
            <div>
                <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Merchant</label>
                <input type="text" id="merchant" value={merchant} onChange={e => setMerchant(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., Amazon, Starbucks" required />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., New York, NY" required />
            </div>
            <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                {isLoading ? 'Analyzing...' : 'Check Transaction'}
            </button>
        </form>
    );
};

const ResultDisplay: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isFraudulent = transaction.status === 'fraudulent';
    const statusColor = isFraudulent ? 'text-red-500' : 'text-green-500';
    const bgColor = isFraudulent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20';
    const borderColor = isFraudulent ? 'border-red-500' : 'border-green-500';

    const Icon = isFraudulent ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );

    return (
        <div className={`border-l-4 ${borderColor} ${bgColor} p-4 mt-6 rounded-md`}>
            <div className="flex">
                <div className="flex-shrink-0">{Icon}</div>
                <div className="ml-3">
                    <p className={`text-sm font-bold ${statusColor} capitalize`}>{transaction.status.replace('_', ' ')}</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{transaction.reason}</p>
                </div>
            </div>
        </div>
    );
};

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onAddTransaction, isLoading, error, lastTransaction }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-1 text-gray-800 dark:text-white">Transaction Fraud Check</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Enter transaction details below to analyze for potential fraud using AI.</p>
                <TransactionForm onSubmit={onAddTransaction} isLoading={isLoading} />
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {isLoading && (
                <div className="text-center mt-4">
                    <p className="text-gray-600 dark:text-gray-400">Analyzing transaction...</p>
                </div>
            )}
            {!isLoading && lastTransaction && <ResultDisplay transaction={lastTransaction} />}
        </div>
    );
};

export default CustomerDashboard;
