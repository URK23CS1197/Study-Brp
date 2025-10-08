// server/controllers/gemini_controller.js - ENHANCED VERSION

const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini (API key is read from Render environment variables)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a structured learning path using Gemini and saves it to the DB
 * using a TRANSACTION to ensure data consistency.
 */
exports.generateCurriculum = async (req, res) => {
    const { topic, goal, userId } = req.body;
    const client = req.db;

    if (!topic || !userId) {
        return res.status(400).json({ error: 'Missing topic or userId.' });
    }

    // Start a transaction instance
    await client.query('BEGIN');

    try {
        // 1. Generate Curriculum JSON
        const prompt = `Act as a curriculum expert. Generate a detailed, structured learning path for '${topic}' 
        to achieve the goal: '${goal}'. Output the plan as a single JSON object with a 'activities' array.
        Ensure the 'activities' array is present and is a list of objects with 'title', 'type', and 'url' fields.`;
        
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
        
        // 2. Save Path to DB (Part of Transaction)
        const pathResult = await client.query(
            'INSERT INTO learning_paths (user_id, topic, overall_progress) VALUES ($1, $2, $3) RETURNING path_id',
            [userId, topic, 0.00]
        );
        const pathId = pathResult.rows[0].path_id;

        // 3. Save Activities (Part of Transaction)
        const activityInserts = curriculumData.activities.map(act =>
            client.query(
                'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
                [pathId, act.title, act.type || 'unknown', act.url || '', 'TO_DO']
            )
        );
        await Promise.all(activityInserts);
        
        // 4. Commit the transaction: All insertions were successful.
        await client.query('COMMIT');

        res.status(201).json({ success: true, pathId });

    } catch (error) {
        // 5. Rollback the transaction: If any step failed, undo all changes.
        await client.query('ROLLBACK');
        
        console.error("Curriculum Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate curriculum via Gemini.', details: error.message });
    }
};


/**
 * Explains uploaded notes using Gemini Vision.
 */
exports.explainUploadedNotes = async (req, res) => {
    const { base64Image, question, mimeType } = req.body;
    
    if (!base64Image || !question) {
        return res.status(400).json({ error: 'Missing image or question.' });
    }

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType || 'image/jpeg',
            },
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [imagePart, `Analyze the uploaded material. Answer this question based *only* on the content: "${question}"`],
        });

        res.status(200).json({ success: true, explanation: response.text });

    } catch (error) {
        console.error("Notes Explanation Error:", error);
        res.status(500).json({ error: 'Failed to process notes via Gemini Vision.' });
    }
};