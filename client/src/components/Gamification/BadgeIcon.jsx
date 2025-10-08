// client/src/components/Gamification/BadgeIcon.jsx (Mock version)
import React from 'react';

const getBadgeDetails = (key) => {
    switch (key) {
        case '7_day_master': return { name: '7-Day Master', icon: '🌟' };
        case 'deep_diver': return { name: 'Deep Diver', icon: '🧠' };
        default: return { name: key, icon: '🏆' };
    }
};

function BadgeIcon({ badgeKey }) {
    const { name, icon } = getBadgeDetails(badgeKey);
    return (
        <div
            className="group relative flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg text-white"
        >
            <span className="text-2xl">{icon}</span>
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 px-2 py-1 bg-gray-800 rounded-lg text-xs">
                {name}
            </div>
        </div>
    );
}
export default BadgeIcon;