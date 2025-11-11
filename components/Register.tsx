import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Spinner from './Spinner';
import { AuthView } from '../App';

interface RegisterProps {
  setAuthView: (view: AuthView) => void;
}

const Register: React.FC<RegisterProps> = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setError('');
    setLoading(true);
    const result = await register(username, 'user', password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Create Account</h2>
      {error && <p className="bg-danger/20 text-danger text-center p-2 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="register-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full !mt-6">
          {loading ? <Spinner /> : 'Register'}
        </Button>
      </form>
      <div className="text-center mt-6 text-text-secondary space-y-2">
        <p>
          Already have an account?{' '}
          <button onClick={() => setAuthView('login')} className="text-highlight hover:underline font-semibold">
            Login
          </button>
        </p>
         <p>
          Are you staff?{' '}
          <button onClick={() => setAuthView('staffRegister')} className="text-highlight hover:underline font-semibold">
            Register as Staff
          </button>
        </p>
      </div>
    </Card>
  );
};

export default Register;