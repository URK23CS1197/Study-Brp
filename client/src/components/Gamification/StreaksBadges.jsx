// client/src/components/Gamification/StreaksBadges.jsx

import React, { useState, useEffect } from 'react';
import BadgeIcon from './BadgeIcon'; // Assumes BadgeIcon.jsx exists
import { apiFetch } from '../../api/backend_calls.js'; 
import { FaFire, FaTrophy } from 'react-icons/fa';

// This is the component logic you previously created (simplified for quick testing)
function StreaksBadges({ userId }) {
    const [streakDays, setStreakDays] = useState(14); // Mock Data
    const [badges, setBadges] = useState(['7_day_master', 'deep_diver']); // Mock Data
    const [isLoading, setIsLoading] = useState(false); // Assume loaded for quick test
    
    // NOTE: In the real app, this useEffect would fetch data:
    /*
    useEffect(() => {
        if (!userId) return;
        // fetch user stats logic here...
    }, [userId]);
    */

    const badgeKeys = Object.keys(badges);

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center">
                    <FaFire className="text-orange-500 text-3xl mr-3" />
                    <span className="text-xl font-semibold text-white">Study Streak</span>
                </div>
                <div className="text-3xl font-extrabold text-orange-400">
                    {streakDays} 🔥
                </div>
            </div>
            {/* If BadgeIcon.jsx exists, this will render */}
            <div className="flex flex-wrap gap-4 mt-4">
                {badges.map((key) => (
                    <div key={key} className="p-1 border border-white/20 rounded-lg">
                        <BadgeIcon badgeKey={key} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default StreaksBadges;