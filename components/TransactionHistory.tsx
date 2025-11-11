import React, { useState } from 'react';
import { Transaction, TransactionStatus, TransactionType } from '../types';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Card from './Card';
import Spinner from './Spinner';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionIcon: React.FC<{ type: TransactionType, isSender: boolean }> = ({ type, isSender }) => {
    let icon;
    let color = 'text-text-secondary';
    
    switch(type) {
        case TransactionType.ACCOUNT_CREATED:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />;
            color = 'text-success';
            break;
        case TransactionType.STAFF_GRANT:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />;
            color = 'text-highlight';
            break;
        case TransactionType.GENERATE:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />;
            color = 'text-success';
            break;
        case TransactionType.REWARD:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />;
            color = 'text-warning';
            break;
        case TransactionType.SEND:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />;
            color = 'text-danger';
            break;
        case TransactionType.RECEIVE:
            icon = <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />;
            color = 'text-success';
            break;
        default:
             icon = <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />;
    }

    return (
        <div className={`p-2 rounded-full bg-secondary ${color}`}>
            <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {icon}
            </svg>
        </div>
    )
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const { user, refreshUser } = useAuth();
  const usersApi = useUsers();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (transactionId: string) => {
    if (!user) return;
    setLoadingId(transactionId);
    await usersApi.acceptCoins(user.username, transactionId);
    refreshUser();
    setLoadingId(null);
  };
  
  const sortedTransactions = [...transactions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getTransactionTitle = (tx: Transaction) => {
    switch(tx.type) {
      case TransactionType.ACCOUNT_CREATED: return 'Account Created';
      case TransactionType.STAFF_GRANT: return 'Initial Staff Grant';
      case TransactionType.GENERATE: return 'Coins Generated';
      case TransactionType.REWARD: return 'Hourly Reward Claimed';
      case TransactionType.SEND: return `Sent to ${tx.to}`;
      case TransactionType.RECEIVE: return `Received from ${tx.from}`;
      default: return 'Transaction';
    }
  }

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4 text-text-primary">Transaction History</h3>
      <div className="space-y-4">
        {sortedTransactions.length === 0 ? (
            <p className="text-text-secondary text-center py-4">No transactions yet.</p>
        ) : (
            sortedTransactions.map((tx) => (
          <div key={tx.id + tx.timestamp} className="flex items-center justify-between bg-secondary p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <TransactionIcon type={tx.type} isSender={tx.from === user?.username} />
              <div>
                <p className="font-bold text-text-primary">
                  {getTransactionTitle(tx)}
                </p>
                <p className="text-sm text-text-secondary">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${tx.type === TransactionType.SEND ? 'text-danger' : 'text-success'}`}>
                {tx.type === TransactionType.SEND ? '-' : '+'} {tx.amount.toFixed(2)} LSC
              </p>
              {tx.type === TransactionType.RECEIVE && tx.status === TransactionStatus.PENDING ? (
                 <Button onClick={() => handleAccept(tx.id)} size="sm" variant="success" disabled={loadingId === tx.id}>
                    {loadingId === tx.id ? <Spinner size="sm"/> : 'Accept'}
                </Button>
              ) : (
                <p className={`text-sm ${tx.status === TransactionStatus.COMPLETED ? 'text-success' : 'text-warning'}`}>
                  {tx.status}
                </p>
              )}
            </div>
          </div>
        )))}
      </div>
    </Card>
  );
};

export default TransactionHistory;