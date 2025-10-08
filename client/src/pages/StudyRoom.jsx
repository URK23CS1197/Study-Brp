import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
// NOTE: We rely on the Render-compatible versions of these components
import PathDisplay from '../components/learning/PathDisplay.jsx'; 
import StressMonitor from '../components/Wellness/StressMonitor.jsx';
import AIChat from '../components/Chat/AIChat.jsx';
import PeerChat from '../components/Chat/PeerChat.jsx';
import StreaksBadges from '../components/Gamification/StreaksBadges.jsx'; 

// 🔑 MOCK AUTH CONTEXT: Since we don't have the final AuthContext.jsx file, 
// we use mock data that you would replace with your real context hook.
const useAuth = () => ({
    userId: 'mock-user-12345',
    user: { displayName: 'Alex H.' },
});

function StudyRoom() {
    // Get user and path data from context and URL parameters
    const { userId, user } = useAuth(); 
    const { pathId: urlPathId } = useParams();
    const pathId = urlPathId;

    // Fallback/Placeholder titles (These should ideally be fetched from the PathDisplay component's state)
    const currentActivityTitle = "Analyzing Linear Regression Models";
    const currentTopic = "Data Science";

    // Check for necessary data before rendering
    if (!userId || !pathId) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="study-room relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 lg:p-8 font-inter text-white overflow-hidden">
            {/* Animated Background Layer (DESIGN PRESERVED) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* Main Content (DESIGN PRESERVED) */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <span className="text-2xl mr-2">🚀</span>
                    <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Study Hub: {currentTopic}
                    </h1>
                </div>

                {/* Top Row: User Info & Gamification */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* User Info */}
                    <div className="col-span-1 md:col-span-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20 flex items-center transition-all duration-300 hover:shadow-cyan-500/25">
                        <span className="text-2xl mr-3">🎓</span>
                        <div>
                            <p className="text-lg font-semibold text-white">
                                Welcome, {user?.displayName || 'Student'}!
                            </p>
                            <p className="text-sm text-gray-400">
                                Path ID: {pathId.substring(0, 8)}... | Active: {currentActivityTitle}
                            </p>
                        </div>
                    </div>

                    {/* Streaks & Badges Component */}
                    <div className="col-span-1 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20 min-h-[100px] transition-all duration-300 hover:shadow-purple-500/25">
                        <StreaksBadges userId={userId} />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Learning Path (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/25">
                            {/* 🔑 PathDisplay now uses API calls */}
                            <PathDisplay pathId={pathId} userId={userId} />
                        </div>
                    </div>

                    {/* Column 2: Tools & Collaboration (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6 flex flex-col">
                        {/* Stress Monitor Component */}
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-red-500/25">
                            {/* 🔑 StressMonitor now uses API calls */}
                            <StressMonitor
                                userId={userId}
                                currentPathId={pathId}
                                currentActivityTitle={currentActivityTitle}
                            />
                        </div>

                        {/* AI Chat Component */}
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-blue-500/25">
                            {/* 🔑 AIChat now uses API calls */}
                            <AIChat currentTopic={currentTopic} />
                        </div>

                        {/* Peer Chat Component */}
                        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-purple-500/25">
                            {/* 🔑 PeerChat now uses Socket.io */}
                            <PeerChat pathId={pathId} userId={userId} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements (DESIGN PRESERVED) */}
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
    );
}

export default StudyRoom;