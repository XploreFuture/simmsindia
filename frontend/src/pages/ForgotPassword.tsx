import React, { useState } from 'react';
import axios from 'axios'; // Keeping axios for API calls
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000'; // Assuming your backend is running here

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setLoading(true);

    try {
      // Make a POST request to your backend's forgot-password endpoint
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });

      // Assuming your backend sends a success message in the response data
      setMessage({ type: 'success', text: response.data.message || 'Password reset link sent to your email!' });
      setEmail(''); // Clear the email field on success
    } catch (err: unknown) {
      console.error('Forgot password error:', err);
      if (axios.isAxiosError(err)) {
        // Handle Axios error (e.g., network error, server responded with non-2xx status)
        setMessage({ 
          type: 'error', 
          text: err.response?.data?.message || err.message || 'Failed to send password reset link. Please try again.' 
        });
      } else if (err instanceof Error) {
        // Handle generic JavaScript error
        setMessage({ type: 'error', text: `An unexpected error occurred: ${err.message}` });
      } else {
        // Handle unknown error types
        setMessage({ type: 'error', text: 'An unknown error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className={`p-3 mb-6 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-colors duration-200 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Remembered your password? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;