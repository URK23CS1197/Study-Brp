// server/server.js - FINAL OPTIMIZATION FOR RENDER DEPLOYMENT

// 🔑 FIX 1: The external dependency imports are correct.
import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import dotenv from 'dotenv';
// IMPORTANT: You must also import the GoogleGenAI client if using it directly in this file
// import { GoogleGenAI } from '@google/genai'; 

// Load environment variables 
dotenv.config();

// 🔑 FIX 2: Convert internal route loader from 'require()' to 'import' 
// This resolves the ReferenceError crash in Node v22 (ESM mode).
import apiRoutes from './routes/api_routes.js'; 


const app = express();
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---

// server/server.js (FINAL CORS FIX)

// --- 1. Middleware ---

// 🔑 FIX: Use the simple cors() middleware to accept all origins (*).
// This is the fastest way to guarantee the CORS header is sent.
app.use(cors()); 

// Allows parsing JSON request bodies (up to 5MB, needed for image base64 upload)
app.use(express.json({ limit: '5mb' })); 

// ... (rest of the file remains the same)
app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup ---

const dbClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
});

async function startServer() {
    try {
        await dbClient.connect();
        console.log('Database connected successfully to Render PostgreSQL');

        app.use((req, res, next) => {
            req.db = dbClient;
            next();
        });

        // --- 3. Routes ---
        app.use('/api', apiRoutes); // This now uses the imported router

        // Simple health check endpoint 
        app.get('/', (req, res) => {
            res.status(200).json({ message: 'AI Study Assistant Backend is running!' });
        });

        // --- 4. Server Start ---

        // Bind to both PORT and HOST to prevent the 'Timed Out' error on Render
        app.listen(PORT, HOST, () => {
            console.log(`Server running and listening on http://${HOST}:${PORT}`);
        });

    } catch (err) {
        console.error('FATAL ERROR: Failed to connect to database or start server.', err.stack);
        // Exit process if DB connection fails
        process.exit(1); 
    }
}

// Execute the function to start the application
startServer();
