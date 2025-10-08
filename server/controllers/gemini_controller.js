// server/controllers/gemini_controller.js (FINAL STABILITY FIX)

// ... (Imports and ai initialization remain the same) ...

/**
 * Generates a structured learning path using Gemini and saves it to the DB
 * using a TRANSACTION to ensure data consistency.
 */
const generateCurriculum = async (req, res) => {
    const { topic, goal, userId } = req.body;
    const pool = req.db; // The connection pool instance
    let client; // Declare client outside try block for access in finally

    if (!topic || !userId) {
        return res.status(400).json({ error: 'Missing topic or userId.' });
    }
    
    try {
        // 🔑 CRITICAL FIX 1: Safely acquire a client from the pool
        client = await pool.connect(); 
        
        // --- Transaction Starts ---
        await client.query('BEGIN');

        // 1. Generate Curriculum JSON (Gemini call)
        // ... (This section remains the same) ...
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });

        // Robust JSON parsing and validation
        let curriculumData;
        try {
            curriculumData = JSON.parse(response.text);
            if (!curriculumData || !Array.isArray(curriculumData.activities)) {
                throw new Error("AI returned invalid JSON structure.");
            }
        } catch (parseError) {
            throw new Error(`Invalid AI response format: ${parseError.message}`);
        }
        
        // 2. Save Path to DB (Use the acquired client for all queries)
        const pathResult = await client.query(
            'INSERT INTO learning_paths (user_id, topic, overall_progress) VALUES ($1, $2, $3) RETURNING path_id',
            [userId, topic, 0.00]
        );
        const pathId = pathResult.rows[0].path_id;

        // 3. Save Activities 
        // ... (activity insertion logic remains the same) ...
        await Promise.all(activityInserts);
        
        // 4. Commit the transaction
        await client.query('COMMIT');

        res.status(201).json({ success: true, pathId });

    } catch (error) {
        // 5. Rollback on failure
        if (client) {
            await client.query('ROLLBACK');
        }
        
        console.error("Curriculum Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate curriculum via Gemini.', details: error.message });
    } finally {
        // 🔑 CRITICAL FIX 2: Always release the client connection back to the pool
        if (client) {
            client.release(); 
        }
    }
};

// ... (The explainUploadedNotes function remains the same, but should also use the pool logic) ...
