import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Spinner from './Spinner';
import { AuthView } from '../App';

interface StaffLoginProps {
  setAuthView: (view: AuthView) => void;
}

const StaffLogin: React.FC<StaffLoginProps> = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, 'staff', undefined, staffCode);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Staff Login</h2>
      {error && <p className="bg-danger/20 text-danger text-center p-2 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="staff-login-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="staff-login-code"
          label="Staff Code"
          type="password"
          value={staffCode}
          onChange={(e) => setStaffCode(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : 'Login as Staff'}
        </Button>
      </form>
      <div className="text-center mt-6 text-text-secondary space-y-2">
        <p>
          Don't have a staff account?{' '}
          <button onClick={() => setAuthView('staffRegister')} className="text-highlight hover:underline font-semibold">
            Register Here
          </button>
        </p>
        <p>
          Not a staff member?{' '}
          <button onClick={() => setAuthView('login')} className="text-highlight hover:underline font-semibold">
            User Login
          </button>
        </p>
      </div>
    </Card>
  );
};

export default StaffLogin;