import React, { useState } from 'react';
// 🔑 CRITICAL FIX: Import useNavigate for routing (required by your code logic)
import { useNavigate } from 'react-router-dom'; 

// 🔑 CRITICAL FIX: Import ALL custom components rendered below (Missing in your provided code block)
import Header from '../components/layout/Header.jsx'; 
import PathProgress from '../components/learning/PathDisplay.jsx'; 
import StreaksBadges from '../components/Gamification/StreaksBadges.jsx'; 
import { FaPlus } from 'react-icons/fa'; // Assuming this icon is used for the "Create Path" button
// FIX: Explicitly specify the .js extension to resolve the import error
import { generateCurriculum } from '../api/backend_calls.js'; 


function Dashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook
    
    const [topic, setTopic] = useState('');
    const [goal, setGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [pathId, setPathId] = useState(null); // To store the generated path ID
    const [error, setError] = useState(''); // To display API errors
    
    // NOTE: You would typically get the userId from a global AuthContext
    const mockUserId = "user-12345"; 

    const handleGeneratePath = async (e) => {
        e.preventDefault();
        if (!topic.trim() || !goal.trim()) return;

        setIsGenerating(true);
        setError('');

        try {
            const result = await generateCurriculum(topic, goal, mockUserId);
            
            if (result.success) {
                setPathId(result.pathId);
                alert('🎉 Learning path generated successfully! Redirecting...');
                
                // 💡 Uncomment this line once your StudyRoom component is ready for live navigation
                // navigate(`/study/${result.pathId}`); 
            } else {
                 throw new Error("Generation failed on the server.");
            }

        } catch (err) {
            console.error("Path Generation Error:", err);
            setError(err.message || 'Failed to generate path. Please check the server.');
            setPathId(null);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Mock Data for Components (Replace with real state data) ---
    const mockPathData = { progress: 0.75, pathTitle: "Data Science Fundamentals" };

    const features = [
        { icon: '🚀', title: 'AI-Powered', desc: 'Smart curriculum generation', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' },
        { icon: '🎯', title: 'Personalized', desc: 'Tailored to your goals', color: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' },
        { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your journey', color: 'from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' },
        { icon: '👥', title: 'Peer Learning', desc: 'Collaborate with others', color: 'from-orange-500 to-red-500', bgColor: 'bg-gradient-to-br from-orange-500/20 to-red-500/20' }
    ];

    const stats = [
        { number: '10K+', label: 'Active Learners', icon: '👨‍🎓' },
        { number: '95%', label: 'Success Rate', icon: '📈' },
        { number: '50+', label: 'Subjects', icon: '📚' },
        { number: '24/7', label: 'AI Support', icon: '🤖' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
            
            {/* Animated Background Elements (Design Preserved) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Navigation Header (DESIGN PRESERVED - Assuming Header.jsx is implemented) */}
            <nav className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-5">
                        {/* Header Logo/Nav Logic... */}
                        {/* NOTE: You should replace this block with your <Header /> component if created */}
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                                <span className="text-white font-bold text-xl">AI</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    LearnAI
                                </span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1 inline-block"></div>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                             <button onClick={() => navigate('/login')} className="px-6 py-2 text-white/80 hover:text-white transition-colors font-medium">Sign In</button>
                             <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">Get Started</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Content - Hero Text & Features */}
                    <div className="space-y-8">
                        {/* Badge and Headings (Design Preserved) */}
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
                            <span className="text-white/80 text-sm font-medium">AI-Powered Learning Platform</span>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                                Create <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Smart</span> Learning Paths
                            </h1>
                            <p className="text-xl text-white/70 leading-relaxed">
                                Transform your goals into structured learning journeys with AI-powered curriculum generation and real-time progress tracking.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div 
                                    key={index} 
                                    className={`${feature.bgColor} backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all duration-500 group hover:scale-105 cursor-pointer`}
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Interactive Form */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                        {/* Form Header and API Error Display (Design Preserved) */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Start Your Journey</h2>
                            <p className="text-white/60">Create your personalized learning path in seconds</p>
                        </div>
                        
                        {error && (
                            <div className="p-3 mb-4 bg-red-800/50 text-red-300 border border-red-400/50 rounded-xl text-sm text-center">
                                Error: {error}
                            </div>
                        )}

                        {/* Interactive Form */}
                        <form onSubmit={handleGeneratePath} className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-white font-semibold text-lg">What do you want to learn? 📚</label>
                                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Data Science, Web Development, Machine Learning..." className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-lg"/>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="block text-white font-semibold text-lg">Your learning goal 🎯</label>
                                <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Get job-ready in 6 months, Build a portfolio project..." className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-lg"/>
                            </div>
                            
                            {/* CTA Button */}
                            <button
                                type="submit"
                                disabled={!topic.trim() || !goal.trim() || isGenerating}
                                className="w-full py-5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                            >
                                {isGenerating ? (<div className="flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>Creating Your Path...</div>) : (<div className="flex items-center justify-center"><span>Generate Learning Path</span><span className="ml-3 group-hover:scale-110 transition-transform">🚀</span></div>)}
                            </button>
                        </form>

                        {/* Trust Indicator */}
                        <div className="mt-6 text-center">
                            <p className="text-white/40 text-sm flex items-center justify-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                Join 10,000+ learners already mastering their skills
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-105 text-center">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    {stat.number}
                                </div>
                                <div className="text-white/60 mt-2 font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-float delay-500"></div>
        </div>
    );
}

export default Dashboard