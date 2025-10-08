// client/src/api/auth.js

import { BASE_API_URL } from './config';

// Utility function to handle standard response parsing
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // Express backend usually sends a JSON error object
        throw new Error(data.message || data.error || `HTTP error! Status: ${response.status}`);
    }
    return data;
};

/**
 * Sends credentials to the Render backend's login route.
 */
export const loginUser = async (email, password) => {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store JWT token
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    
    // 🔑 CRITICAL: Store the userId for use by other components (e.g., StreaksBadges)
    // Assume your Express server sends back a user object with a unique 'user_id'.
    if (data.user && data.user.user_id) {
        // NOTE: The user object should be stored globally in a context in a final app.
        localStorage.setItem('userId', data.user.user_id);
        // Also store the display name for the StudyRoom header
        localStorage.setItem('userName', data.user.displayName || 'Student'); 
    }
    
    return data.user; 
};

/**
 * EXPORT 1: Logs the user out by removing tokens.
 */
export const logoutUser = () => {
    localStorage.removeItem('authToken');
    // Also remove the stored user ID and Name
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userName'); 
};

/**
 * EXPORT 2: Checks if a token exists to maintain the login state in App.jsx.
 * (Fixes the "No matching export for checkAuthToken" error).
 */
export const checkAuthToken = () => {
    const token = localStorage.getItem('authToken');
    // For a hackathon, checking for the existence of the token is sufficient.
    return !!token; 
};