import React, { useRef, useEffect, useState } from 'react';
// 🔑 REMOVE: import { functions } from '../../api/firebase';
// 🔑 IMPORT the specific API function for the AFL trigger
import { triggerWellnessBreak } from '../../api/backend_calls'; 

const STRESS_THRESHOLD = 85; // Stress score that triggers the break
const SUSTAINED_STRESS_TIME = 30; // Seconds of sustained stress required

function StressMonitor({ userId, currentPathId, currentActivityTitle }) {
    const videoRef = useRef(null);
    const [stressCounter, setStressCounter] = useState(0);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [stressScore, setStressScore] = useState(0); // Track current stress score for display
    const [isAflTriggered, setIsAflTriggered] = useState(false); // New state to prevent multiple triggers

    // Initialize Camera and Start Monitoring
    useEffect(() => {
        let intervalId;
        const startMonitoring = async () => {
            if (!navigator.mediaDevices) {
                console.error("Media devices not supported in this browser.");
                setIsMonitoring(false);
                return;
            }

            try {
                // NOTE: In a production version, you would integrate MediaPipe here
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsMonitoring(true);
                    // Start analyzing frames every second
                    intervalId = setInterval(analyzeFrame, 1000); 
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                setIsMonitoring(false);
            }
        };

        if (userId && !isMonitoring) {
            startMonitoring();
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [userId]);

    // Frame Analysis Logic
    const analyzeFrame = () => {
        // 💡 MOCK LOGIC: In a real app, this would use ML models (MediaPipe/TFLite)
        const detectedScore = Math.random() < 0.2 ? 90 : Math.floor(Math.random() * 70);
        setStressScore(detectedScore); // Update stress score for display

        if (detectedScore > STRESS_THRESHOLD && !isAflTriggered) {
            setStressCounter(prev => {
                const newCount = prev + 1;
                if (newCount >= SUSTAINED_STRESS_TIME) {
                    // Trigger the backend AFL and reset counter
                    triggerBreak({ userId, currentPathId, currentActivityTitle, stressScore: detectedScore });
                    setIsAflTriggered(true); // Prevent re-trigger until page reload
                    return 0;
                }
                return newCount;
            });
        } else if (detectedScore <= STRESS_THRESHOLD) {
            // Reset counter only if stress is below threshold
            setStressCounter(0); 
        }
    };

    // Trigger Backend Function (Render API Call)
    const triggerBreak = async (data) => {
        try {
            // ----------------------------------------------------
            // 🔑 REAL API CALL INTEGRATION: POST /api/stress-trigger
            // ----------------------------------------------------
            const result = await triggerWellnessBreak(
                data.userId, 
                data.currentPathId, 
                data.currentActivityTitle
            );
            
            if (result.success) {
                 console.log("AI detected high stress! Break scheduled and path adjusted.");
                 // Optionally set a global state/alert for break scheduled
            } else {
                throw new Error(result.message || "AFL server response failed.");
            }
        } catch (error) {
            console.error("Error triggering stress detection:", error);
            // Re-enable triggering if the API call itself failed
            setIsAflTriggered(false); 
        }
    };

    // Calculate stress progress percentage for the progress bar
    const stressProgress = (stressCounter / SUSTAINED_STRESS_TIME) * 100;

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-md mx-auto">
            {/* Animated Background Elements (DESIGN PRESERVED) */}
            <div className="absolute inset-0">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Content (DESIGN PRESERVED) */}
            <div className="relative z-10">
                {/* Header */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                    <span className="text-xl mr-2">🧠</span>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Focus Monitor
                    </h3>
                </div>

                {/* Camera Error State */}
                {!isMonitoring && (
                    <div className="p-3 mb-4 bg-red-800/50 text-red-300 border border-red-400/50 rounded-xl text-sm text-center">
                        Camera access denied or failed. Please check permissions.
                    </div>
                )}

                {/* Camera Feed and Stress Metrics */}
                {isMonitoring && (
                    <>
                        {/* Video Feed */}
                        <div className="relative mb-4 rounded-xl overflow-hidden border border-white/20">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                width="100%"
                                height="auto"
                                className="rounded-xl"
                            ></video>
                            <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                                Live
                            </div>
                        </div>

                        {/* Stress Score Display */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-white/80 mb-2">
                                Current Stress Score: {stressScore}
                            </p>
                            <div className="h-2 bg-white/10 rounded-full border border-white/20 overflow-hidden">
                                <div
                                    style={{ width: `${stressScore}%` }}
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        stressScore > STRESS_THRESHOLD
                                            ? 'bg-gradient-to-r from-red-500 to-pink-500'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                    } shadow-lg`}
                                ></div>
                            </div>
                        </div>

                        {/* Sustained Stress Progress */}
                        <div className="group relative">
                            <p className="text-sm font-medium text-white/80 mb-2">
                                Sustained Stress: {stressCounter}s / {SUSTAINED_STRESS_TIME}s
                            </p>
                            <div className="h-3 bg-white/10 rounded-full border border-white/20 overflow-hidden">
                                <div
                                    style={{ width: `${stressProgress}%` }}
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        stressCounter > 0
                                            ? 'bg-gradient-to-r from-red-500 to-pink-500'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                    } shadow-lg`}
                                ></div>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute hidden group-hover:block top-full mt-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs border border-white/20">
                                {Math.round(stressProgress)}% to Break Trigger
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-4 text-center">
                            <p
                                className={`text-sm font-medium ${
                                    stressCounter > 0 ? 'text-red-400 animate-pulse' : 'text-green-400'
                                }`}
                            >
                                {stressCounter > 0
                                    ? 'High stress detected! Consider a break soon.'
                                    : 'Stress levels normal. Keep going!'}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Floating Elements (DESIGN PRESERVED) */}
            <div className="absolute bottom-2 left-2 w-12 h-12 bg-cyan-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-2 right-2 w-10 h-10 bg-purple-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
    );
}

export default StressMonitor;