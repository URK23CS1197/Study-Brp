// server/server.js - FINAL, STABLE CODE FOR RENDER

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'; 
import dotenv from 'dotenv';
import apiRoutes from './routes/api_routes.js'; // Ensure api_routes.js uses ESM exports

// Load environment variables 
dotenv.config();

const app = express();
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
app.use(cors()); 
app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup (Using Pool for Stability) ---

const pool = new Pool({
    // IMPORTANT: The DATABASE_URL must have ?sslmode=require appended to it 
    // This value is read from your Render Environment Variables.
    connectionString: process.env.DATABASE_URL, 
    
    // CRITICAL: We remove the complex 'ssl' object to let the URL handle it, 
    // but the final fix requires ensuring the code knows we need a secure connection.
    // If running into this error, the solution is usually to set the environment variable
    // PGSSLMODE=no-verify or use a client certificate, but we'll try the simplest route first.
    
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
});


// Use an async function to handle the connection and server start
async function startServer() {
    try {
        // Test connection once before starting server
        const client = await pool.connect();
        client.release(); // Release the client immediately
        console.log('Database pool initialized and connected successfully.');

        // Pass the connection pool instance to the request object
        app.use((req, res, next) => {
            req.db = pool; 
            next();
        });

        // --- 3. Routes ---
        app.use('/api', apiRoutes); 

        // Simple health check endpoint 
        app.get('/', (req, res) => {
            res.status(200).json({ message: 'AI Study Assistant Backend is running!' });
        });

        // --- 4. Server Start ---
        app.listen(PORT, HOST, () => {
            console.log(`Server running and listening on http://${HOST}:${PORT}`);
        });

    } catch (err) {
        // Log the certificate error explicitly
        console.error('FATAL ERROR: Failed to connect to database or start server.', err.stack);
        // The error is likely the certificate; exit if the DB connection fails
        process.exit(1); 
    }
}

// Execute the function to start the application
startServer();
