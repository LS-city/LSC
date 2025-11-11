import { useState, useCallback } from 'react';
import { User, Transaction, TransactionType, TransactionStatus } from '../types';

// Mock staff code
const STAFF_CODE = 'LSCS';
const USER_INITIAL_BALANCE = 10;
const STAFF_INITIAL_BALANCE = 1000;


// Helper for generating unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock "database" using localStorage
const getUsersFromStorage = (): User[] => {
  const usersJson = localStorage.getItem('lsc-coin-users');
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('lsc-coin-users', JSON.stringify(users));
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(getUsersFromStorage);

  const saveUsers = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  }, []);

  const getUser = useCallback((username: string) => {
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }, [users]);

  const getStaffMembers = useCallback(() => {
    return users.filter(u => u.role === 'staff');
  }, [users]);

  // FIX: Reordered parameters to place required `role` before optional `password`.
  const login = async (username: string, role: 'user' | 'staff', password?: string, staffCode?: string) => {
    const user = getUser(username);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }
    if (user.role !== role) {
      return { success: false, message: `Incorrect role. Try the ${user.role} login.` };
    }
    
    if (role === 'staff') {
      if (staffCode?.trim().toUpperCase() !== STAFF_CODE) {
        return { success: false, message: 'Invalid staff code.' };
      }
    } else { // role is 'user'
      if (user.passwordHash !== password) {
        return { success: false, message: 'Incorrect password.' };
      }
    }
    
    return { success: true, message: 'Login successful.' };
  };

  // FIX: Reordered parameters to place required `role` before optional `password`.
  const register = async (username: string, role: 'user' | 'staff', password?: string, staffCode?: string) => {
    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters.' };
    }
    if (getUser(username)) {
      return { success: false, message: 'Username already exists.' };
    }

    if (role === 'staff') {
      if (staffCode?.trim().toUpperCase() !== STAFF_CODE) {
        return { success: false, message: 'Invalid staff code for registration.' };
      }
    } else { // role is 'user'
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
    }

    const isStaff = role === 'staff';
    const initialBalance = isStaff ? STAFF_INITIAL_BALANCE : USER_INITIAL_BALANCE;
    const initialTransactionType = isStaff ? TransactionType.STAFF_GRANT : TransactionType.ACCOUNT_CREATED;

    const newUser: User = {
      username,
      balance: initialBalance,
      transactions: [
        {
          id: generateId(),
          type: initialTransactionType,
          from: 'system',
          to: username,
          amount: initialBalance,
          timestamp: new Date().toISOString(),
          status: TransactionStatus.COMPLETED,
        },
      ],
      role,
    };

    if (role === 'user') {
      newUser.passwordHash = password;
    }
    
    saveUsers([...users, newUser]);
    return { success: true, message: 'Registration successful.' };
  };

  const generateCoins = async (username: string, amount: number) => {
    const updatedUsers = users.map(u => {
      if (u.username === username) {
        const newTransaction: Transaction = {
          id: generateId(),
          type: TransactionType.GENERATE,
          from: 'system',
          to: username,
          amount,
          timestamp: new Date().toISOString(),
          status: TransactionStatus.COMPLETED,
        };
        return {
          ...u,
          balance: u.balance + amount,
          transactions: [...u.transactions, newTransaction],
        };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  const sendCoins = async (fromUsername: string, toUsername: string, amount: number) => {
    const sender = getUser(fromUsername);
    const recipient = getUser(toUsername);

    if (!sender) {
      return { success: false, message: 'Sender not found.' };
    }
    if (!recipient) {
      return { success: false, message: 'Recipient not found.' };
    }
    if (sender.username === recipient.username) {
      return { success: false, message: "You can't send coins to yourself." };
    }
    if (sender.balance < amount) {
      return { success: false, message: 'Insufficient funds.' };
    }
    if (recipient.role === 'staff') {
        return { success: false, message: 'You cannot send coins to a staff member.'};
    }

    const transactionId = generateId();
    const timestamp = new Date().toISOString();

    const sendTransaction: Transaction = {
      id: transactionId,
      type: TransactionType.SEND,
      from: fromUsername,
      to: toUsername,
      amount,
      timestamp,
      status: TransactionStatus.PENDING,
    };

    const receiveTransaction: Transaction = {
      id: transactionId,
      type: TransactionType.RECEIVE,
      from: fromUsername,
      to: toUsername,
      amount,
      timestamp,
      status: TransactionStatus.PENDING,
    };

    const updatedUsers = users.map(u => {
      if (u.username === fromUsername) {
        return { ...u, balance: u.balance - amount, transactions: [...u.transactions, sendTransaction] };
      }
      if (u.username === toUsername) {
        return { ...u, transactions: [...u.transactions, receiveTransaction] };
      }
      return u;
    });

    saveUsers(updatedUsers);
    return { success: true, message: `Successfully sent ${amount} LSC to ${toUsername}.` };
  };

  const acceptCoins = async (username: string, transactionId: string) => {
    let receivingUser: User | undefined;
    const updatedUsers = users.map(u => {
      if (u.username === username) {
        let transactionAmount = 0;
        const updatedTransactions = u.transactions.map(tx => {
          if (tx.id === transactionId && tx.status === TransactionStatus.PENDING && tx.type === TransactionType.RECEIVE) {
            transactionAmount = tx.amount;
            return { ...tx, status: TransactionStatus.COMPLETED };
          }
          return tx;
        });

        if (transactionAmount > 0) {
          receivingUser = { ...u, balance: u.balance + transactionAmount, transactions: updatedTransactions };
          return receivingUser;
        }
      }
      return u;
    });

    if (receivingUser) {
        // Mark sender's transaction as completed as well
        const finalUsers = updatedUsers.map(u => {
          const updatedTransactions = u.transactions.map(tx => {
            if (tx.id === transactionId) {
              return { ...tx, status: TransactionStatus.COMPLETED };
            }
            return tx;
          });
          return { ...u, transactions: updatedTransactions };
        });
        saveUsers(finalUsers);
    }
  };
  
  const claimHourlyReward = async (username: string) => {
    const user = getUser(username);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const cooldownMinutes = 60;
    const now = new Date();
    if (user.lastRewardClaimed) {
      const lastClaimDate = new Date(user.lastRewardClaimed);
      const diffMs = now.getTime() - lastClaimDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      if (diffMins < cooldownMinutes) {
        const minutesRemaining = cooldownMinutes - diffMins;
        return { success: false, message: `Please wait ${minutesRemaining} more minute${minutesRemaining > 1 ? 's' : ''}.` };
      }
    }

    const rewardAmount = 100;

    const updatedUsers = users.map(u => {
      if (u.username === username) {
        const newTransaction: Transaction = {
          id: generateId(),
          type: TransactionType.REWARD,
          from: 'system',
          to: username,
          amount: rewardAmount,
          timestamp: now.toISOString(),
          status: TransactionStatus.COMPLETED,
        };
        return {
          ...u,
          balance: u.balance + rewardAmount,
          transactions: [...u.transactions, newTransaction],
          lastRewardClaimed: now.toISOString(),
        };
      }
      return u;
    });

    saveUsers(updatedUsers);
    return { success: true, message: `Successfully claimed ${rewardAmount} LSC!` };
  };

  return { users, getUser, getStaffMembers, login, register, generateCoins, sendCoins, acceptCoins, claimHourlyReward };
};