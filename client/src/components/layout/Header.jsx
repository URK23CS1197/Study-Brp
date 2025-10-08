// client/src/components/layout/Header.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth.js'; // Import the function to clear the token

function Header({ userName = 'Student', currentPath = '/' }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        // Redirect to the login page after logging out
        navigate('/login');
    };

    return (
        <nav className="relative z-20 bg-white/10 backdrop-blur-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    
                    {/* Logo/Title */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">AI</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            LearnAI Hub
                        </span>
                    </div>

                    {/* User Info and Sign Out Button */}
                    <div className="flex items-center space-x-4">
                        {/* User Display */}
                        <div className="hidden sm:block text-white/80 text-sm font-medium">
                            Hello, {userName}!
                        </div>
                        
                        {/* Sign Out Button */}
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600/80 hover:bg-red-700/90 rounded-xl text-white text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;