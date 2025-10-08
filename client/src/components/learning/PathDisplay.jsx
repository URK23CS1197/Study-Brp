import React, { useState, useEffect } from 'react';
// 🔑 REMOVE: import { db, functions } from '../../api/firebase';
// 🔑 REMOVE: import { doc, onSnapshot } from 'firebase/firestore';
// 🔑 IMPORT the generic API wrapper for data and the completion action
import { apiFetch, apiPost } from '../../api/backend_calls.js'; 

function PathDisplay({ pathId, userId }) {
    const [path, setPath] = useState({ modules: [] });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 🔑 Replaces Firestore listener with standard HTTP GET fetch on mount
    useEffect(() => {
        if (!pathId || !userId) {
            setError('Missing path ID or user ID.');
            setIsLoading(false);
            return;
        }

        const fetchPathData = async () => {
            try {
                // ----------------------------------------------------
                // 🔑 REAL API CALL INTEGRATION: GET /api/path/:pathId
                // ----------------------------------------------------
                // NOTE: This assumes you create a GET route in Express to fetch all path/module/activity data.
                const data = await apiFetch(`/path/${pathId}`, 'GET');
                
                if (data) {
                    setPath({ ...data, modules: data.modules || [] });
                    setError('');
                } else {
                    setPath({ modules: [] });
                    setError('Learning path not found.');
                }
            } catch (err) {
                console.error('Error fetching path data:', err);
                setError('Failed to load learning path from Render API.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPathData();
        // ❌ REMOVED: No unsubscribe needed for stateless HTTP fetch.
    }, [pathId, userId]);

    // Function to mark an activity as complete
    const handleCompleteActivity = async (moduleId, activityId) => {
        // Optimistically update the UI to feel responsive
        // NOTE: A real-time app would then refetch/update data via an event or subscription

        try {
            // ----------------------------------------------------
            // 🔑 REAL API CALL INTEGRATION: POST /api/activity-complete
            // ----------------------------------------------------
            // NOTE: This assumes you create a POST route for this action
            const result = await apiPost('/activity-complete', { 
                pathId, 
                moduleId, 
                activityId, 
                userId 
            });

            if (result.success) {
                alert("Activity marked complete! Progress recalculation running on server.");
                // You would typically trigger a path data refresh here (re-run useEffect logic)
            } else {
                throw new Error(result.error || "Server failed to mark activity as complete.");
            }

        } catch (error) {
            console.error('Error completing activity:', error);
            setError('Failed to mark activity as complete.');
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-4xl mx-auto">
            {/* Animated Background Elements (DESIGN PRESERVED) */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>

            {/* Content (DESIGN PRESERVED) */}
            <div className="relative z-10">
                {/* Error Display */}
                {error && (
                    <div className="p-3 mb-4 bg-red-800/50 text-red-300 border border-red-400/50 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center justify-center text-white/80">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Generating your personalized path...
                        </div>
                    </div>
                )}

                {/* Path Content */}
                {!isLoading && (
                    <>
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                            <span className="text-2xl mr-2">🚀</span>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                {path.topic || 'New Learning Path'}
                            </h2>
                        </div>

                        {/* Overall Progress Bar */}
                        <div className="mb-6 group relative">
                            <p className="text-sm font-medium text-white/80 mb-2">
                                Overall Progress: {Math.round((path.overall_progress || 0) * 100)}%
                            </p>
                            <div className="h-3 bg-white/10 rounded-full border border-white/20 overflow-hidden">
                                <div
                                    style={{ width: `${(path.overall_progress || 0) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 shadow-lg"
                                ></div>
                            </div>
                            {/* Progress Tooltip (DESIGN PRESERVED) */}
                            <div className="absolute hidden group-hover:block top-full mt-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs border border-white/20">
                                {Math.round((path.overall_progress || 0) * 100)}% Complete
                            </div>
                        </div>

                        {/* Modules and Activities List */}
                        {path.modules.length === 0 ? (
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white/60 text-sm text-center">
                                No modules available yet. Start learning to populate your path!
                            </div>
                        ) : (
                            path.modules.map((module, mIdx) => (
                                <div
                                    key={module.title || mIdx}
                                    className="module bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border-l-4 border-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-cyan-500/25 transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 animate-pulse animate-once">
                                        {module.title} ({Math.round((module.progress || 0) * 100)}%)
                                    </h3>
                                    {(module.activities || []).map((activity, aIdx) => (
                                        <div
                                            key={activity.title || aIdx}
                                            className={`activity-item p-3 mb-2 rounded-md flex justify-between items-center transition-all duration-300 hover:scale-105 ${
                                                activity.status === 'COMPLETED'
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                    : 'bg-white/5 text-white/90 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{activity.title}</span>
                                                <span className="text-xs text-white/60 uppercase">{activity.type}</span>
                                            </div>
                                            {activity.status !== 'COMPLETED' ? (
                                                <button
                                                    onClick={() => handleCompleteActivity(module.title, activity.title)}
                                                    className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm rounded-full hover:from-cyan-600 hover:to-blue-700 hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                                                >
                                                    Mark Done
                                                </button>
                                            ) : (
                                                <span className="text-sm">✅ Completed</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>

            {/* Floating Elements (DESIGN PRESERVED) */}
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
    );
}

export default PathDisplay;