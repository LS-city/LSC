import React from 'react';
import { useAuth } from '../hooks/useAuth';
import GenerateCoins from './GenerateCoins';
import SendCoins from './SendCoins';
import TransactionHistory from './TransactionHistory';
import ClaimReward from './ClaimReward';
import Card from './Card';
import { User } from '../types';
import StaffList from './StaffList';

const StaffDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8">
      <Card className="text-center">
        <h2 className="text-4xl font-bold text-highlight mb-4">Welcome, Staff Member {user.username}!</h2>
        <p className="text-xl text-text-secondary">You have special administrative powers.</p>
        <p className="text-lg text-text-secondary mt-2">Your current balance is: <span className="font-bold text-white">{user.balance.toFixed(2)} LSC</span></p>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StaffList />
        <TransactionHistory transactions={user.transactions} />
      </div>
    </div>
  )
}


const Dashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }
  
  if (user.role === 'staff') {
    return <StaffDashboard user={user} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div>
                <h2 className="text-4xl font-bold text-highlight">Dashboard</h2>
                <p className="text-text-secondary mt-1">Manage your LSC coins and transactions.</p>
            </div>
            <div className="mt-4 sm:mt-0">
                <p className="text-text-secondary">Current Balance</p>
                <p className="text-3xl font-bold text-white">{user.balance.toFixed(2)} LSC</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GenerateCoins onCoinGenerated={refreshUser} />
        <SendCoins onCoinSent={refreshUser} />
        <ClaimReward onRewardClaimed={refreshUser} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionHistory transactions={user.transactions} />
        <StaffList />
      </div>
    </div>
  );
};

export default Dashboard;