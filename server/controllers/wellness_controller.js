// server/controllers/wellness_controller.js

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Schedules a break using an external Calendar API (Placeholder).
 */
const scheduleBreak = (userId) => {
    // NOTE: Integrate Google Calendar API or similar service here.
    console.log(`Scheduling 10-min mindful break for user: ${userId}`);
    return { calendarId: 'MOCK_CAL_EVENT' }; 
};

/**
 * Uses Gemini to suggest a lower-stress replacement activity (AFL).
 */
const suggestAFLActivity = async (activityTitle) => {
    const prompt = `User is struggling and stressed on activity: '${activityTitle}'. 
    Suggest one lower-stress, complementary follow-up activity (e.g., a simple video or analogy breakdown) 
    to re-engage them. Output the new activity details as a JSON object with 'title', 'type', and 'url'.`;
    
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
exports.triggerAFL = async (req, res) => {
    const { userId, pathId, currentActivityTitle } = req.body;
    const client = req.db;
    
    if (!userId || !pathId) {
        return res.status(400).json({ error: 'Missing user or path ID.' });
    }

    try {
        // 1. Schedule Wellness Break
        const breakResult = scheduleBreak(userId);

        // 2. Affective Feedback Loop (AFL) Trigger
        const newActivity = await suggestAFLActivity(currentActivityTitle);

        // 3. Insert new activity into the path
        await client.query(
            'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
            [pathId, newActivity.title, newActivity.type, newActivity.url, 'TO_DO']
        );
        
        res.status(200).json({ 
            success: true, 
            message: "Break scheduled. New supportive activity added.",
            newActivity: newActivity,
            breakId: breakResult.calendarId
        });
        
    } catch (error) {
        console.error("Wellness/AFL Error:", error);
        res.status(500).json({ error: 'Failed to trigger AFL process.' });
    }
};