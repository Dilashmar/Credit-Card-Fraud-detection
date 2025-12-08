import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Transaction, TransactionStatus } from '../types';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import CustomerDashboard from './CustomerDashboard';

// Pre-seeded data for demonstration purposes
const initialTransactions: Transaction[] = [
  { id: 'txn_1', amount: 125.50, merchant: 'Amazon', location: 'New York, NY', status: 'approved', reason: 'Common merchant, typical amount.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'txn_2', amount: 2500.00, merchant: 'RareGems Inc.', location: 'Miami, FL', status: 'fraudulent', reason: 'High-value transaction from a new, untrusted merchant.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'txn_3', amount: 7.25, merchant: 'Starbucks', location: 'Seattle, WA', status: 'approved', reason: 'Low-value, everyday purchase.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'txn_4', amount: 850.00, merchant: 'Electronics R Us', location: 'London, UK', status: 'in_review', reason: 'Unusual international transaction, requires manual verification.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'txn_5', amount: 45.00, merchant: 'Target', location: 'Chicago, IL', status: 'approved', reason: 'Regular retail purchase.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'txn_6', amount: 1750.00, merchant: 'CryptoExchange Pro', location: 'Online', status: 'fraudulent', reason: 'High-risk merchant flagged as potential fraud.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'txn_7', amount: 32.50, merchant: 'Uber', location: 'San Francisco, CA', status: 'approved', reason: 'Familiar service, normal amount.', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'txn_8', amount: 650.00, merchant: 'Best Buy', location: 'Austin, TX', status: 'in_review', reason: 'Moderate transaction amount requires manual review.', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: 'txn_9', amount: 15.00, merchant: 'Netflix', location: 'Los Angeles, CA', status: 'approved', reason: 'Recurring subscription payment.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'txn_10', amount: 89.99, merchant: 'Walmart', location: 'Dallas, TX', status: 'approved', reason: 'Normal retail purchase.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'txn_11', amount: 3200.00, merchant: 'Luxury Watches LLC', location: 'Paris, France', status: 'fraudulent', reason: 'High-value international luxury item flagged.', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'txn_12', amount: 22.75, merchant: 'Chipotle', location: 'Boston, MA', status: 'approved', reason: 'Common food purchase.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
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
  
  // Initialize transactions from localStorage or use initial data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [lastTransaction, setLastTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

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

    // Variable delay for more realistic ML processing (500ms - 2500ms)
    const processingDelay = 500 + Math.random() * 2000;

    setTimeout(() => {
      let status: TransactionStatus = 'approved';
      let reason = 'Transaction pattern matches legitimate activity.';

      // Enhanced "ML" fraud detection rules
      const merchantLower = newTransactionData.merchant.toLowerCase();
      const locationLower = newTransactionData.location.toLowerCase();
      
      // High-risk keywords
      const fraudKeywords = ['crypto', 'bitcoin', 'gems', 'rare', 'luxury', 'offshore', 'wire', 'gift card'];
      const suspiciousLocations = ['unknown', 'online', 'tor', 'vpn', 'proxy'];
      
      if (newTransactionData.amount > 5000) {
        status = 'fraudulent';
        reason = 'High-value transaction exceeds risk threshold. Flagged for potential fraud.';
      } else if (newTransactionData.amount > 1500) {
        status = 'in_review';
        reason = 'Elevated transaction amount requires manual verification by fraud analyst.';
      } else if (fraudKeywords.some(keyword => merchantLower.includes(keyword))) {
        status = 'fraudulent';
        reason = `Merchant "${newTransactionData.merchant}" matches high-risk merchant pattern.`;
      } else if (suspiciousLocations.some(loc => locationLower.includes(loc))) {
        status = 'in_review';
        reason = 'Unusual location detected. Requires manual review.';
      } else if (newTransactionData.amount > 800) {
        status = 'in_review';
        reason = 'Transaction amount flagged for routine verification.';
      }

      const newTransaction: Transaction = {
        ...newTransactionData,
        id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        status,
        reason,
        timestamp: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setLastTransaction(newTransaction);
      setIsLoading(false);
    }, processingDelay);
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
            allTransactions={transactions}
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
