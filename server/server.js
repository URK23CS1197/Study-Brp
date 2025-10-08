// server/server.js - FINAL, STABLE CODE FOR RENDER

// 🔑 Module Fix: Using standard ESM imports
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'; 
import dotenv from 'dotenv';
import apiRoutes from './routes/api_routes.js'; 

// Load environment variables 
dotenv.config();

const app = express();
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
// 🔑 FIX: Universal CORS (*) to ensure no frontend errors
app.use(cors()); 
app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup (Using Pool for Stability) ---

const pool = new Pool({
    // IMPORTANT: DATABASE_URL must contain the host, username, password, and database name.
    connectionString: process.env.DATABASE_URL, 
    
    // FIX: Removing the explicit 'ssl' object to prevent the certificate error
    // We rely on the connection string itself to handle SSL parameters like ?sslmode=require
    
    max: 5, // Max clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
});


// Use an async function to handle the connection and server start
async function startServer() {
    try {
        // Test connection once before starting server (CRITICAL STABILITY CHECK)
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
        // Log the severe error and exit the process
        console.error('FATAL ERROR: Failed to connect to database or start server.', err.stack);
        process.exit(1); 
    }
}

// Execute the function to start the application
startServer();
