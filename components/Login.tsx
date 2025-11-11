import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Spinner from './Spinner';
import { AuthView } from '../App';

interface LoginProps {
  setAuthView: (view: AuthView) => void;
}

const Login: React.FC<LoginProps> = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // FIX: Updated function call to match reordered parameters.
    const result = await login(username, 'user', password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-center mb-6 text-text-primary">Welcome Back</h2>
      {error && <p className="bg-danger/20 text-danger text-center p-2 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="login-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner /> : 'Login'}
        </Button>
      </form>
      <div className="text-center mt-6 text-text-secondary space-y-2">
        <p>
          Don't have an account?{' '}
          <button onClick={() => setAuthView('register')} className="text-highlight hover:underline font-semibold">
            Register
          </button>
        </p>
        <p>
          Are you staff?{' '}
          <button onClick={() => setAuthView('staffLogin')} className="text-highlight hover:underline font-semibold">
            Staff Login
          </button>
        </p>
      </div>
    </Card>
  );
};

// FIX: Added default export to resolve the "no default export" error. The original file was truncated.
export default Login;
