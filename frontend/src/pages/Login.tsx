import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import type { LoginRequest, LoginResponse, ApiErrorResponse } from '../types/api';
import { setAccessTokenAndDispatch } from '../utils/auth'; // Keeping setAccessTokenAndDispatch as requested

const BACKEND_URL = 'http://localhost:5000'; // Keeping BACKEND_URL as requested

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location object

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const loginData: LoginRequest = { email, password };

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            let data: LoginResponse | ApiErrorResponse;
            try {
                data = await response.json();
            } catch (jsonError: unknown) {
                console.error("Failed to parse JSON response:", jsonError);
                // FIX: Changed 'msg' to 'message' for consistency with ApiErrorResponse
                data = { msg: `Server error: ${response.statusText || 'No response body'}` }; 
            }

            if (response.ok) {
                const loginResponse = data as LoginResponse;
                setAccessTokenAndDispatch(loginResponse.accessToken);

                // FIX: Ensure 'message' property is used for success message
                setMessage({ type: 'success', text: loginResponse.message || 'Login successful!' });
                setEmail('');
                setPassword('');
                
                // Navigate to the previous page if available, otherwise to home
                const from = location.state?.from?.pathname || '/';
                setTimeout(() => {
                    navigate(from, { replace: true }); // Use replace to avoid stacking login page in history
                }, 1000);
            } else {
                const errorData = data as ApiErrorResponse;
                // FIX: Ensure 'message' property is used for error message
                let errorMessage = errorData.msg || 'Login failed.'; // Changed from errorData.msg to errorData.message
                if (errorData.errors) {
                    const fieldErrors = Object.entries(errorData.errors)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join('\n');
                    errorMessage += `\nDetails:\n${fieldErrors}`;
                }
                setMessage({ type: 'error', text: errorMessage });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage({ type: 'error', text: `Network error: ${error.message}. Is the backend running?` });
            } else {
                setMessage({ type: 'error', text: 'An unknown network error occurred during login.' });
            }
            console.error('Frontend network error during login:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <img
                        className="mx-auto h-20 w-auto"
                        src="/simms.png"
                        alt="Simms Logo"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Log in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`p-3 rounded-md text-sm ${
                                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    Not registered?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;