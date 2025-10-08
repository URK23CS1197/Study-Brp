// server/controllers/wellness_controller.js (FINAL STABILITY FIX)

// ... (Imports and function definitions remain the same) ...

/**
 * Main function triggered by the frontend's Stress Monitor (AFL Trigger).
 */
const triggerAFL = async (req, res) => {
    const pool = req.db; // The connection pool
    let client; // Declare client outside try block

    const { userId, pathId, currentActivityTitle } = req.body;
    
    if (!userId || !pathId) {
        return res.status(400).json({ error: 'Missing user or path ID.' });
    }

    try {
        // 🔑 FIX 1: Safely acquire a client connection from the pool
        client = await pool.connect(); 

        // 1. Schedule Wellness Break
        const breakResult = scheduleBreak(userId);

        // 2. Affective Feedback Loop (AFL) Trigger
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
        // 🔑 CRITICAL FIX 2: Release the client connection back to the pool
        if (client) {
            client.release(); 
        }
    }
};

// ... (Rest of file remains the same) ...
