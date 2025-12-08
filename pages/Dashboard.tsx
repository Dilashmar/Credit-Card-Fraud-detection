import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Transaction, TransactionStatus } from '../types';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import CustomerDashboard from './CustomerDashboard';

// Pre-seeded data for demonstration purposes
const initialTransactions: Transaction[] = [
  { id: 'txn_1', amount: 125.50, merchant: 'Amazon', location: 'New York, NY', status: 'approved', reason: 'Common merchant, typical amount.', timestamp: new Date().toISOString() },
  { id: 'txn_2', amount: 2500.00, merchant: 'RareGems Inc.', location: 'Miami, FL', status: 'fraudulent', reason: 'High-value transaction from a new, untrusted merchant.', timestamp: new Date().toISOString() },
  { id: 'txn_3', amount: 7.25, merchant: 'Starbucks', location: 'Seattle, WA', status: 'approved', reason: 'Low-value, everyday purchase.', timestamp: new Date().toISOString() },
  { id: 'txn_4', amount: 850.00, merchant: 'Electronics R Us', location: 'London, UK', status: 'in_review', reason: 'Unusual international transaction, requires manual verification.', timestamp: new Date().toISOString() },
];

/**
 * This component acts as a switcher. It checks the authenticated user's role
 * and renders the appropriate dashboard component. It also provides a consistent
 * layout with a header and logout button for all dashboard views.
 *
 * It is now also responsible for managing the global transaction state for this demo.
 */
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [lastTransaction, setLastTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This should not happen if protected correctly, but provides a safe fallback.
  if (!user) {
    return null;
  }
  
  /**
   * Simulates an AI fraud detection model.
   * In a real application, this would be an API call.
   */
  const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id' | 'status' | 'reason' | 'timestamp'>) => {
    setIsLoading(true);
    setError(null);
    setLastTransaction(undefined);

    setTimeout(() => {
      let status: TransactionStatus = 'approved';
      let reason = 'Transaction appears normal.';

      if (newTransactionData.amount > 1500) {
        status = 'fraudulent';
        reason = 'High transaction amount triggered fraud alert.';
      } else if (newTransactionData.amount > 500) {
        status = 'in_review';
        reason = 'Moderate transaction amount requires manual review.';
      } else if (['crypto', 'gems', 'art'].some(keyword => newTransactionData.merchant.toLowerCase().includes(keyword))) {
        status = 'fraudulent';
        reason = 'Transaction with high-risk merchant flagged as potential fraud.';
      }

      const newTransaction: Transaction = {
        ...newTransactionData,
        id: `txn_${Math.random().toString(36).substring(2, 9)}`,
        status,
        reason,
        timestamp: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setLastTransaction(newTransaction);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleUpdateTransaction = (id: string, newStatus: TransactionStatus, newReason: string) => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === id 
          ? { ...txn, status: newStatus, reason: newReason } 
          : txn
      )
    );
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case UserRole.Admin:
        return <AdminDashboard transactions={transactions} />;
      case UserRole.Employee:
        return <EmployeeDashboard transactions={transactions} onUpdateTransaction={handleUpdateTransaction} />;
      case UserRole.Customer:
        return (
          <CustomerDashboard
            onAddTransaction={handleAddTransaction}
            isLoading={isLoading}
            error={error}
            lastTransaction={lastTransaction}
          />
        );
      default:
        // Fallback for any unknown roles
        return <p>Your dashboard is not available.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.role} Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-gray-600 dark:text-gray-300">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
