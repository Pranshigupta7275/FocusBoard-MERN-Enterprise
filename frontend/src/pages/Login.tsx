import React, { useState, type JSX } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../slices/apiSlice';
import { setCredentials } from '../slices/authSlice';

const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      
      // CAST TO ANY: Bypasses strict TS2339 properties error on 'LoginResponse'
      const responseObj = response as any;
      
      // Safely extract the nested user structure regardless of API wrapper style
      const actualUserData = responseObj.data || responseObj.user || responseObj;
      
      const userDataToSave = {
        ...actualUserData,
        // Fallback to ensure token is appended cleanly
        token: actualUserData.token || responseObj.token 
      };
      
      // Save the cleaned user data to Redux
      dispatch(setCredentials(userDataToSave));
      
      // Trigger success notification
      toast.success(`Welcome back, ${userDataToSave.name || 'User'}!`);

      // Route based on role
      if (userDataToSave.isAdmin || userDataToSave.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err: any) {
      console.error("Login Error Details:", err);
      toast.error(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your dashboard and manage your tasks.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="admin@example.com"
              autoComplete="email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-2.5 px-4 mt-2 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Section */}
        <div className="flex flex-col items-center mt-8 space-y-4 pt-6 border-t border-slate-100">
          <Link 
            to="/passwordless" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Login with OTP (Passwordless)
          </Link>
          
          <div className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;