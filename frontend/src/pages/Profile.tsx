import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { UserProfile, UpdateProfileRequest } from '../types/api';
import { fetchWithAuth } from '../utils/api';
import { decodeAccessToken } from '../utils/auth'; // To get the user's ID from the token

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        gender: null,
        dob: null,
    });
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const currentUserId = decodeAccessToken()?.id;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUserId) {
                setMessage('User not authenticated. Please log in.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await fetchWithAuth<UserProfile>(`/api/profile`); 
                if (data) {
                    setProfile(data);
                    setFormData({
                        gender: data.gender || null,
                        dob: data.dob || null,
                    });
                    setMessage(null);
                } else {
                    setMessage('Failed to load profile. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage(`Error fetching profile: 'An unexpected error occurred.'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUserId]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSuccess(false);
        setSubmitting(true);
        try {
            const updatedProfile = await fetchWithAuth<UserProfile>('/api/profile', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (updatedProfile) {
                setProfile(updatedProfile);
                setMessage('✅ Profile updated successfully!');
                setIsSuccess(true);
            } else {
                setMessage('❌ Failed to update profile. Please check console for details.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage(`❌ Error updating profile: 'An unexpected error occurred.'}`);
            setIsSuccess(false);
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-700">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Profile Not Found</h2>
                    <p className="text-gray-700">{message || "Could not load user profile."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Profile</h2>

            {message && (
                <div className={`p-3 mb-4 rounded-md text-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email and Username (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={profile.username}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={profile.email}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender || ''} // Handle null for select
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        disabled={submitting}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob ? (formData.dob.split('T')[0]) : ''} // Format date for input type="date"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        disabled={submitting}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
                        submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={submitting}
                >
                    {submitting ? 'Updating Profile...' : 'Update Profile'}
                </button>
            </form>
            <div className="text-center mt-6">
                <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
            </div>
        </div>
    );
};

export default Profile;