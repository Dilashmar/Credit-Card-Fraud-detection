import React, { useState } from 'react';
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

interface ActionModalProps {
    transaction: Transaction;
    action: 'approve' | 'reject';
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ transaction, action, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    const isApprove = action === 'approve';
    const buttonColor = isApprove ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    const title = isApprove ? 'Approve Transaction' : 'Reject Transaction';
    const iconColor = isApprove ? 'text-green-600' : 'text-red-600';
    const bgColor = isApprove ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className={`${bgColor} rounded-lg p-4 mb-4`}>
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${iconColor}`}>
                                {isApprove ? (
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <span className="font-mono font-semibold">{transaction.id}</span> • ${transaction.amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                                    {transaction.merchant} • {transaction.location}
                                </p>
                            </div>
                        </div>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason for {action}:
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide a detailed reason for this decision..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                        rows={4}
                    />
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(reason)}
                            disabled={!reason.trim()}
                            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransactionList: React.FC<{ 
    transactions: Transaction[];
    onUpdateTransaction: (id: string, status: Transaction['status'], reason: string) => void;
}> = ({ transactions, onUpdateTransaction }) => {
    const [activeModal, setActiveModal] = useState<{ transactionId: string; action: 'approve' | 'reject' } | null>(null);

    const handleActionClick = (id: string, action: 'approve' | 'reject') => {
        setActiveModal({ transactionId: id, action });
    };

    const handleConfirmAction = (reason: string) => {
        if (activeModal) {
            const newStatus = activeModal.action === 'approve' ? 'approved' : 'fraudulent';
            onUpdateTransaction(activeModal.transactionId, newStatus, reason);
            setActiveModal(null);
        }
    };

    if (transactions.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No transactions to display.</p>;
    }

    return (
        <>
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
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
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
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            {transaction.status === 'in_review' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleActionClick(transaction.id, 'approve')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(transaction.id, 'reject')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    >
                                                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Reviewed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {activeModal && (
                <ActionModal
                    transaction={transactions.find(t => t.id === activeModal.transactionId)!}
                    action={activeModal.action}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setActiveModal(null)}
                />
            )}
        </>
    );
};


const EmployeeDashboard: React.FC<{ 
    transactions: Transaction[];
    onUpdateTransaction: (id: string, status: Transaction['status'], reason: string) => void;
}> = ({ transactions, onUpdateTransaction }) => {
    return (
        <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Transaction Monitoring</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
                <TransactionList transactions={transactions} onUpdateTransaction={onUpdateTransaction} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
