import { logoutUser as originalLogoutUser } from './api';
// Import UserProfile type
import type { UserProfile } from '../types/api';

/**
 * Dispatches a custom event to notify other parts of the application
 * about a change in authentication status (e.g., login, logout).
 */
const dispatchAuthChangeEvent = () => {
    window.dispatchEvent(new Event('authStatusChange'));
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('accessToken');
};

export const decodeAccessToken = (): Pick<UserProfile, 'id' | 'username' | 'email' | 'role'> | null => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return null;
    }
    try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        // Cast the parsed JSON to the expected type, ensuring _id and role are present
        const decodedPayload = JSON.parse(jsonPayload) as Pick<UserProfile, 'id' | 'username' | 'email' | 'role'>;
        return decodedPayload;
    } catch (error) {
        console.error("Error decoding access token:", error);
        return null;
    }
};

/**
 * Handles user logout by calling the core logout API and dispatching a custom event.
 * @returns {Promise<boolean>} True if logout is successful, false otherwise.
 */
export const logout = async (): Promise<boolean> => {
    const success = await originalLogoutUser(); // Use the renamed import here
    if (success) {
        dispatchAuthChangeEvent(); // Dispatch event on successful logout
    }
    return success;
};

/**
 * Sets the access token in localStorage and dispatches a custom event
 * to notify other components of the authentication status change (e.g., after login).
 * @param {string} token The access token string to store.
 */
export const setAccessTokenAndDispatch = (token: string) => {
    localStorage.setItem('accessToken', token);
    dispatchAuthChangeEvent(); // Dispatch event on successful login
};