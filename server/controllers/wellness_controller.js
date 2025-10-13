// server/controllers/wellness_controller.js (FINAL ESM & POOL-SAFE VERSION)

import { GoogleGenAI } from '@google/genai';
// NOTE: Assuming the helper functions (scheduleBreak, suggestAFLActivity) are defined above or imported.

// Initialize Gemini (key is read from Render environment variables)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// --- Placeholder Helpers (Assume these are defined in the file) ---
const scheduleBreak = (userId) => { /* ... returns breakResult ... */ };
const suggestAFLActivity = async (activityTitle) => { /* ... returns newActivity ... */ };


/**
 * Main function triggered by the frontend's Stress Monitor (AFL Trigger).
 * * NOTE: This function requires database connection safety.
 */
export const triggerAFL = async (req, res) => {
    const pool = req.db; 
    let client; 
    const { userId, pathId, currentActivityTitle } = req.body;

    if (!userId || !pathId) {
        return res.status(400).json({ error: 'Missing user or path ID.' });
    }

    try {
        // 1. Acquire a client connection from the pool (CRITICAL)
        client = await pool.connect(); 

        // 2. Schedule Break (API Call Placeholder)
        const breakResult = scheduleBreak(userId);

        // 3. Affective Feedback Loop (Gemini Call)
        const newActivity = await suggestAFLActivity(currentActivityTitle);

        // 4. Insert new activity into the path (Use the acquired client)
        await client.query(
            'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
            [pathId, newActivity.title, newActivity.type, newActivity.url, 'TO_DO']
        );
        
        return res.status(200).json({ 
            success: true, 
            message: "Break scheduled. Path adjusted by AI.",
            newActivity: newActivity,
            breakId: breakResult.calendarId
        });
        
    } catch (error) {
        console.error("Wellness/AFL Error:", error);
        return res.status(500).json({ error: 'Failed to trigger AFL process.', details: error.message });
    } finally {
        // 5. Release the connection (CRITICAL for server stability)
        if (client) {
            client.release(); 
        }
    }
};
