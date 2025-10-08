// client/src/api/backend_calls.js

import { BASE_API_URL } from './config';

// Utility to retrieve the stored JWT token
const getToken = () => localStorage.getItem('authToken');

// ----------------------------------------------------
// 🔑 EXPORTED CORE UTILITY 1: apiFetch (Handles GET, generic, and authenticated calls)
// ----------------------------------------------------
/**
 * Generic core function to handle all API requests (GET, POST, PUT, DELETE).
 * Includes the JWT token for authentication.
 */
export const apiFetch = async (endpoint, method = 'GET', body = null) => {
    const url = `${BASE_API_URL}${endpoint}`;
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        // 🔑 FIX: Include JWT token in the Authorization header for protected routes
        'Authorization': token ? `Bearer ${token}` : '',
    };

    const config = {
        method,
        headers,
        // Only include body for POST, PUT, PATCH
        body: body ? JSON.stringify(body) : null,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Throw an error with the detailed message from the Express backend
            throw new Error(data.error || `HTTP error! Status: ${response.status} at ${endpoint}`);
        }
        return data;
    } catch (error) {
        // Log the full error and re-throw
        console.error(`API Call Error to ${endpoint}:`, error.message);
        throw error;
    }
};

// ----------------------------------------------------
// 🔑 EXPORTED CORE UTILITY 2: apiPost (Handles all POST requests)
// ----------------------------------------------------
/**
 * Convenience wrapper for POST requests (Used by PathDisplay, AIChat, StressMonitor).
 */
export const apiPost = async (endpoint, body) => {
    // 🔑 FIX: This reuses the robust apiFetch logic and exports the required name.
    return apiFetch(endpoint, 'POST', body);
};

// --- High-Level API Functions (Mapping to Render Backend Routes) ---

/**
 * POST /api/curriculum: Generates a new path using Gemini.
 */
export const generateCurriculum = (topic, goal, userId) => {
    // Uses the exported apiPost utility
    return apiPost('/curriculum', { topic, goal, userId });
};

/**
 * POST /api/notes-explain: Explains notes using Gemini Vision.
 */
export const explainUploadedNotes = (base64Image, question, mimeType) => {
    // Uses the exported apiPost utility
    return apiPost('/notes-explain', { base64Image, question, mimeType });
};

/**
 * POST /api/stress-trigger: Activates AFL, schedules break, and adjusts path.
 */
export const triggerWellnessBreak = (userId, pathId, currentActivityTitle) => {
    // Uses the exported apiPost utility
    return apiPost('/stress-trigger', { userId, pathId, currentActivityTitle });
};

/**
 * POST /api/activity-complete: Marks an activity complete.
 */
export const completeActivity = (activityId, userId) => {
    // Uses the exported apiPost utility
    return apiPost('/activity-complete', { activityId, userId });
};