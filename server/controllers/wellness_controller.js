// server/controllers/wellness_controller.js (ESM Compliant and Pool-Safe)

// 🔑 FIX 1: Convert require to import for all external dependencies
import { GoogleGenAI } from '@google/genai'; 

// Initialize Gemini (key is read from Render environment variables)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// --- Internal Helper Functions (Must be defined using const) ---

// NOTE: These placeholder functions must be defined in this file or imported.
const scheduleBreak = (userId) => {
    console.log(`Scheduling 10-min mindful break for user: ${userId}`);
    return { calendarId: 'MOCK_CAL_EVENT' }; 
};

const suggestAFLActivity = async (activityTitle) => {
    const prompt = `User is struggling on activity: '${activityTitle}'. Suggest one complementary activity...`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
    });
    
    return JSON.parse(response.text);
};


/**
 * Main function triggered by the frontend's Stress Monitor (AFL Trigger).
 */
const triggerAFL = async (req, res) => {
    const pool = req.db; 
    let client; 

    const { userId, pathId, currentActivityTitle } = req.body;
    
    if (!userId || !pathId) {
        return res.status(400).json({ error: 'Missing user or path ID.' });
    }

    try {
        // 🔑 CRITICAL FIX 2: Safely acquire a client connection from the pool
        client = await pool.connect(); 

        // 1. Schedule Wellness Break (Placeholder)
        const breakResult = scheduleBreak(userId);

        // 2. Affective Feedback Loop (AFL) Trigger (Gemini Call)
        const newActivity = await suggestAFLActivity(currentActivityTitle);

        // 3. Insert new activity into the path (Use the acquired client)
        await client.query(
            'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
            [pathId, newActivity.title, newActivity.type, newActivity.url, 'TO_DO']
        );
        
        return res.status(200).json({ 
            success: true, 
            message: "Break scheduled. New supportive activity added.",
            newActivity: newActivity,
            breakId: breakResult.calendarId
        });
        
    } catch (error) {
        console.error("Wellness/AFL Error:", error);
        return res.status(500).json({ error: 'Failed to trigger AFL process.', details: error.message });
    } finally {
        // 🔑 CRITICAL FIX 3: Always release the client connection back to the pool
        if (client) {
            client.release(); 
        }
    }
};


// 🔑 FIX 4: Export the function using the ES Module standard
export default {
    triggerAFL
};
