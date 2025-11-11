
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import Button from './Button';
import Card from './Card';
import Spinner from './Spinner';

const COOLDOWN_HOURS = 1;

interface ClaimRewardProps {
    onRewardClaimed: () => void;
}

const ClaimReward: React.FC<ClaimRewardProps> = ({ onRewardClaimed }) => {
    const { user } = useAuth();
    const usersApi = useUsers();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0); // Cooldown in seconds
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        if (!user) return;

        const calculateCooldown = () => {
            if (!user.lastRewardClaimed) {
                setCooldown(0);
                return;
            }
            const lastClaimDate = new Date(user.lastRewardClaimed);
            const now = new Date();
            const diffMs = now.getTime() - lastClaimDate.getTime();
            const diffSeconds = Math.floor(diffMs / 1000);
            const totalCooldownSeconds = COOLDOWN_HOURS * 60 * 60;

            if (diffSeconds < totalCooldownSeconds) {
                setCooldown(totalCooldownSeconds - diffSeconds);
            } else {
                setCooldown(0);
            }
        };

        calculateCooldown();
    }, [user]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleClaim = async () => {
        if (!user) return;

        setMessage(null);
        setLoading(true);

        const result = await usersApi.claimHourlyReward(user.username);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            onRewardClaimed(); // This will refresh the user data and recalculate cooldown
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <Card>
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Hourly Reward</h3>
            {message && (
                 <p className={`${message.type === 'error' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'} text-center p-2 rounded-md mb-4`}>
                    {message.text}
                </p>
            )}
            <p className="text-text-secondary mb-6">
                Claim your reward of 100 LSC every hour to stay active!
            </p>
            <Button 
                onClick={handleClaim}
                disabled={loading || cooldown > 0}
                className="w-full"
            >
                {loading ? <Spinner /> : cooldown > 0 ? `Claim in ${formatTime(cooldown)}` : 'Claim 100 LSC'}
            </Button>
        </Card>
    );
};

export default ClaimReward;
