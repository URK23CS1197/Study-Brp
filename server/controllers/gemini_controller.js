// server/controllers/gemini_controller.js

// ... (Imports and ai initialization remain the same) ...


/**
 * Generates a structured learning path using Gemini and saves it to the DB.
 */
const generateCurriculum = async (req, res) => {
    const { topic, goal, userId } = req.body;
    const pool = req.db; // The connection pool instance
    let client; 
    
    if (!topic || !userId) {
        return res.status(400).json({ error: 'Missing topic or userId.' });
    }

    try {
        // 🔑 CRITICAL FIX 1: Safely acquire a client from the pool
        client = await pool.connect(); 
        
        // --- Transaction Starts ---
        await client.query('BEGIN');
        
        // 1. Define the PROMPT variable correctly (Missing previously!)
        const prompt = `Act as a curriculum expert. Generate a detailed, structured learning path for '${topic}' 
        to achieve the goal: '${goal}'. Output the plan as a single JSON object with a 'activities' array.
        Ensure the 'activities' array is present and is a list of objects with 'title', 'type', and 'url' fields.`;
        
        // 2. Gemini call and robust parsing
        const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });
        
        let curriculumData = JSON.parse(response.text);

        if (!curriculumData || !Array.isArray(curriculumData.activities)) {
            throw new Error("AI returned invalid JSON structure.");
        }

        // 3. Insert Path (CRITICAL: Needs original insertion logic)
        const pathResult = await client.query(
            'INSERT INTO learning_paths (user_id, topic, overall_progress) VALUES ($1, $2, $3) RETURNING path_id',
            [userId, topic, 0.00]
        );
        const pathId = pathResult.rows[0].path_id;

        // 4. Save Activities (CRITICAL: Needs original insertion logic)
        const activityInserts = curriculumData.activities.map(act =>
            client.query(
                'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
                [pathId, act.title, act.type || 'unknown', act.url || '', 'TO_DO']
            )
        );
        await Promise.all(activityInserts);
        
        // 5. Commit the transaction
        await client.query('COMMIT');

        res.status(201).json({ success: true, pathId });
        
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Curriculum Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate curriculum via Gemini.', details: error.message });
    } finally {
        // 🔑 CRITICAL FIX 2: Always release the client connection back to the pool
        if (client) {
            client.release(); 
        }
    }
};

// ... (explainUploadedNotes and export default block remains the same) ...
