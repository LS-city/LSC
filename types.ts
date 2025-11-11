// FIX: Removed a conflicting import of types that are defined within this file.

export enum TransactionType {
  GENERATE = 'GENERATE',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  REWARD = 'REWARD',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  STAFF_GRANT = 'STAFF_GRANT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  from: string; // username or 'system'
  to: string; // username
  amount: number;
  timestamp: string; // ISO string
  status: TransactionStatus;
}

export interface User {
  username: string;
  passwordHash?: string; // In a real app, this would be a hash.
  balance: number;
  transactions: Transaction[];
  role: 'user' | 'staff';
  lastRewardClaimed?: string;
}