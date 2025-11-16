// Defines the roles a user can have within the application.
export enum UserRole {
  Customer = 'Customer',
  Employee = 'Employee',
  Admin = 'Admin',
}

// Represents the structure of a user object.
export interface User {
  email: string;
  role: UserRole;
}

// Defines the possible statuses of a transaction.
export type TransactionStatus = 'approved' | 'fraudulent' | 'in_review';

// Represents the structure of a transaction object.
export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  status: TransactionStatus;
  reason: string;
  timestamp: string;
}
