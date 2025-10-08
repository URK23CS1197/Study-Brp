import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
// 🔑 FIX: Added .js extension to resolve import errors
import { checkAuthToken, logoutUser } from './api/auth.js'; 

// Import Pages
import Dashboard from './pages/Dashboard.jsx';
import StudyRoom from './pages/StudyRoom.jsx';
import Login from './pages/Login.jsx'; 

// ------------------------------------------------------------------
// 🔑 REWRITTEN AUTH CONTEXT/PROTECTION FOR RENDER (TOKEN-BASED)
// NOTE: This simplified version checks localStorage directly.
// ------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // 1. Check for the token provided by the Render backend after successful login
        const token = localStorage.getItem('authToken');
        
        // Use the checkAuthToken utility for robust checking (if needed, though localStorage check is fine)
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [location.pathname]); // Re-check auth state when navigating

    // Show loading state while checking the token
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-medium text-white bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">Verifying session...</div>;
    }

    // If no token exists, redirect to the login page
    if (!isAuthenticated) {
        // IMPORTANT: Redirect to /login if token is missing
        return <Navigate to="/login" replace />; 
    }

    // If token is present, show the requested component
    return children;
};

// Main App Component
function App() {
    return (
        // 🔑 Note: BrowserRouter wrapper is assumed to be in client/src/main.jsx, 
        // so we don't need it here.
        <div className="min-h-screen font-sans">
            <Routes>
                
                {/* 1. Login/Authentication Route */}
                <Route path="/login" element={<Login />} /> 

                {/* 2. Main Landing/Dashboard Route - Public for easy viewing */}
                <Route path="/" element={<Dashboard />} /> 
                
                {/* 3. The Study Room is the main workspace, NOW PROTECTED by the token check */}
                <Route 
                    path="/study/:pathId" 
                    element={
                        <ProtectedRoute>
                            <StudyRoom />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Catch-all route, directs unknown paths to the main dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;