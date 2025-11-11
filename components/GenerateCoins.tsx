import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import Button from './Button';
import Card from './Card';
import Spinner from './Spinner';

const COOLDOWN_SECONDS = 30;

interface GenerateCoinsProps {
  onCoinGenerated: () => void;
}

const GenerateCoins: React.FC<GenerateCoinsProps> = ({ onCoinGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { user } = useAuth();
  const usersApi = useUsers();

  useEffect(() => {
    // FIX: Use ReturnType<typeof setInterval> for the timer type.
    // This is compatible with both browser (number) and Node.js (NodeJS.Timeout) environments,
    // resolving the "Cannot find namespace 'NodeJS'" error in a browser-focused context.
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGenerate = async () => {
    if (!user || cooldown > 0) return;

    setLoading(true);
    const amount = Math.floor(Math.random() * 10) + 1; // Generate between 1 and 10 coins
    await usersApi.generateCoins(user.username, amount);
    onCoinGenerated();
    setLoading(false);
    setCooldown(COOLDOWN_SECONDS);
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4 text-text-primary">Generate Coins</h3>
      <p className="text-text-secondary mb-6">
        Click the button to generate a random amount of LSC coins. You can do this once every {COOLDOWN_SECONDS} seconds.
      </p>
      <Button onClick={handleGenerate} disabled={loading || cooldown > 0} className="w-full">
        {loading ? <Spinner /> : cooldown > 0 ? `Wait ${cooldown}s` : 'Generate LSC'}
      </Button>
    </Card>
  );
};

export default GenerateCoins;
