// server/server.js - FINAL OPTIMIZATION FOR STABILITY

// 🔑 FIX 1: Use standard 'import' syntax for top-level libraries
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'; // NOTE: Switched Client to Pool for better connection management
import dotenv from 'dotenv';
// IMPORTANT: You MUST import the controllers you need
import apiRoutes from './routes/api_routes.js'; 

// Load environment variables 
dotenv.config();

const app = express();
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---

// 🔑 FIX 2: Universal CORS (*) to resolve the frontend error
app.use(cors()); 

app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup (Using Pool for Stability) ---

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
    // 🔑 FINAL FIX: Add connection pooling parameters to prevent sudden closes
    max: 5,                       // Max number of clients in the pool
    idleTimeoutMillis: 30000,     // Close idle clients after 30s
    connectionTimeoutMillis: 2000, // Give up trying to connect after 2s
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
            // Attach the pool itself, allowing controllers to get a client on demand
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
        console.error('FATAL ERROR: Failed to connect to database or start server.', err.stack);
        process.exit(1); 
    }
}

// Execute the function to start the application
startServer();
