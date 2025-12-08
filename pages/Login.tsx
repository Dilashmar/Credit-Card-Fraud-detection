
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (auth.user) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth.user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Validate email and password
    const validCredentials = [
      { email: 'admin@company.com', password: 'DemoPassword123!' },
      { email: 'employee@company.com', password: 'DemoPassword123!' },
      { email: 'customer@example.com', password: 'DemoPassword123!' }
    ];
    
    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    );
    
    if (!isValid) {
      setError('Invalid email or password. Please use one of the demo accounts above.');
      return;
    }
    
    auth.login(email);
    navigate('/dashboard');
  };

  const quickLogin = (exampleEmail: string) => {
    setEmail(exampleEmail);
    setPassword('DemoPassword123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl">
        <div>
          <div className="flex justify-center mb-4">
            <svg className="h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Fraud Detection System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Quick Login Examples */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Demo Accounts:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => quickLogin('admin@company.com')}
              className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors border border-indigo-200 dark:border-indigo-700"
            >
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Admin:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">admin@company.com</span>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('employee@company.com')}
              className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-md hover:bg-green-100 dark:hover:bg-gray-600 transition-colors border border-green-200 dark:border-green-700"
            >
              <span className="font-semibold text-green-600 dark:text-green-400">Employee:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">employee@company.com</span>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('customer@example.com')}
              className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors border border-blue-200 dark:border-blue-700"
            >
              <span className="font-semibold text-blue-600 dark:text-blue-400">Customer:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">customer@example.com</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click to auto-fill, then click Sign In</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;