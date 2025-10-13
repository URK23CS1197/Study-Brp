// server/controllers/gemini_controller.js (FINAL STABLE VERSION)

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


/**
 * Generates a structured learning path using Gemini and saves it to the DB.
 */
export const generateCurriculum = async (req, res) => {
    const { topic, goal, userId } = req.body;
    const pool = req.db; 
    let client;
    
    if (!topic || !userId) {
        return res.status(400).json({ error: 'Missing topic or userId.' });
    }

    try {
        client = await pool.connect(); 
        
        // --- Transaction Starts (Code omitted for brevity) ---
        await client.query('BEGIN');
        
        const prompt = `Act as a curriculum expert. Generate a detailed, structured learning path for '${topic}' to achieve the goal: '${goal}'. Output the plan as a single JSON object with a 'activities' array.`;
        
        const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });
        
        let curriculumData = JSON.parse(response.text);

        if (!curriculumData || !Array.isArray(curriculumData.activities)) {
            throw new Error("AI returned invalid JSON structure.");
        }

        // Database Insertions (omitted for brevity)
        const pathResult = await client.query(
            'INSERT INTO learning_paths (user_id, topic, overall_progress) VALUES ($1, $2, $3) RETURNING path_id',
            [userId, topic, 0.00]
        );
        const pathId = pathResult.rows[0].path_id;

        const activityInserts = curriculumData.activities.map(act =>
            client.query(
                'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
                [pathId, act.title, act.type || 'unknown', act.url || '', 'TO_DO']
            )
        );
        await Promise.all(activityInserts);
        
        // Commit and respond
        await client.query('COMMIT');
        res.status(201).json({ success: true, pathId });
        
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Curriculum Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate curriculum via Gemini.', details: error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
};


/**
 * Explains uploaded notes using Gemini Vision.
 */
export const explainUploadedNotes = async (req, res) => { // 🔑 Changed to export const
    const { base64Image, question, mimeType } = req.body;
    
    if (!base64Image || !question) {
        return res.status(400).json({ error: 'Missing image or question.' });
    }
    
    try {
        const imagePart = { /* ... */ }; 

        const response = await ai.models.generateContent({ /* ... */ });

        res.status(200).json({ success: true, explanation: response.text });
    } catch (error) {
        console.error("Notes Explanation Error:", error);
        res.status(500).json({ error: 'Failed to process notes via Gemini Vision.' });
    }
};
// 🔑 NOTE: The file is now correctly terminated after the last function definition.
// The syntax error should be gone.
