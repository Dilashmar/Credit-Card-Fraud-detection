import React from 'react';
import { Transaction } from '../types';

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const statusStyles = {
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        fraudulent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        in_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${statusStyles[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    if (transactions.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No transactions to display.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">Transaction ID</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Amount</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Merchant</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hidden sm:table-cell">Location</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hidden md:table-cell">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 dark:text-gray-400 sm:pl-6">{transaction.id}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">${transaction.amount.toFixed(2)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{transaction.merchant}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{transaction.location}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400"><StatusBadge status={transaction.status} /></td>
                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell max-w-xs truncate" title={transaction.reason}>{transaction.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const EmployeeDashboard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    return (
        <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Transaction Monitoring</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
