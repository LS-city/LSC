
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Spinner from './Spinner';

interface SendCoinsProps {
  onCoinSent: () => void;
}

const SendCoins: React.FC<SendCoinsProps> = ({ onCoinSent }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const usersApi = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      setLoading(false);
      return;
    }

    const result = await usersApi.sendCoins(user.username, recipient, parsedAmount);
    
    if (result.success) {
      setSuccess(`Sent ${parsedAmount} LSC to ${recipient}. They must accept the transaction.`);
      setRecipient('');
      setAmount('');
      onCoinSent();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4 text-text-primary">Send Coins</h3>
      {error && <p className="bg-danger/20 text-danger text-center p-2 rounded-md mb-4">{error}</p>}
      {success && <p className="bg-success/20 text-success text-center p-2 rounded-md mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="recipient"
          label="Recipient's Username"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <Input
          id="amount"
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0.01"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : 'Send LSC'}
        </Button>
      </form>
    </Card>
  );
};

export default SendCoins;