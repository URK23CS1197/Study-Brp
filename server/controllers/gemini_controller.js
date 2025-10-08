// server/controllers/gemini_controller.js

// 🔑 FIX 1: Ensure imports use ESM syntax
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini (API key is read from Render environment variables)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


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
        // 🔑 CRITICAL FIX: Safely acquire a client from the pool
        client = await pool.connect(); 
        
        // --- Transaction Starts ---
        await client.query('BEGIN');
        
        // --- [The rest of your CURRICULUM GENERATION logic] ---
        // 1. Gemini call and parsing logic here...
        // 2. Database insertions using 'client.query()'
        // 3. Commit the transaction: await client.query('COMMIT');
        
        // The placeholder logic:
        const prompt = `...`; // your original prompt
        const response = await ai.models.generateContent({ /* ... */ });
        let curriculumData = JSON.parse(response.text);

        // ... (insertions logic using client.query) ...

        await client.query('COMMIT');
        res.status(201).json({ success: true, pathId: 'mock-id' }); // Mock response
        
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


/**
 * Explains uploaded notes using Gemini Vision.
 */
const explainUploadedNotes = async (req, res) => {
    // 🔑 NOTE: This function does NOT use the database, so it doesn't need pool.connect/release.
    const { base64Image, question, mimeType } = req.body;
    
    if (!base64Image || !question) {
        return res.status(400).json({ error: 'Missing image or question.' });
    }
    
    try {
        // ... (Gemini API call logic remains the same) ...
        const response = await ai.models.generateContent({ /* ... */ });

        res.status(200).json({ success: true, explanation: response.text });
    } catch (error) {
        console.error("Notes Explanation Error:", error);
        res.status(500).json({ error: 'Failed to process notes via Gemini Vision.' });
    }
};


// 🔑 FINAL EXPORT: Export all functions using the ESM standard (single default export)
export default {
    generateCurriculum,
    explainUploadedNotes
};
