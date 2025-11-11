import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Spinner from './Spinner';
import { AuthView } from '../App';

interface StaffRegisterProps {
  setAuthView: (view: AuthView) => void;
}

const StaffRegister: React.FC<StaffRegisterProps> = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(username, 'staff', undefined, staffCode);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Staff Registration</h2>
      {error && <p className="bg-danger/20 text-danger text-center p-2 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="staff-register-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
            id="staff-register-staff-code"
            label="Staff Code"
            type="password"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            required
        />
        <Button type="submit" disabled={loading} className="w-full !mt-6">
          {loading ? <Spinner /> : 'Register as Staff'}
        </Button>
      </form>
      <p className="text-center mt-6 text-text-secondary">
        Already have a staff account?{' '}
        <button onClick={() => setAuthView('staffLogin')} className="text-highlight hover:underline font-semibold">
          Staff Login
        </button>
      </p>
    </Card>
  );
};

export default StaffRegister;