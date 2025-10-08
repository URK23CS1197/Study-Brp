// server/server.cjs - Optimized for Render Deployment

// 🔑 FINAL FIX: Use standard 'import' syntax for top-level libraries
import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables (critical for local testing, safe for Render)
dotenv.config();

// NOTE: We MUST keep the internal route loader as 'require' since 
// the router files were written in CommonJS format (module.exports).
const apiRoutes = require('./routes/api_routes'); 

const app = express();
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---

const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin })); 

app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup ---

const dbClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } 
});

// Use an async function to handle the connection and server start
async function startServer() {
    try {
        await dbClient.connect();
        console.log('Database connected successfully to Render PostgreSQL');

        // Pass the DB client instance to the request object (available as req.db in controllers)
        app.use((req, res, next) => {
            req.db = dbClient;
            next();
        });

        // --- 3. Routes ---
        app.use('/api', apiRoutes);

        // Simple health check endpoint (used by Render for status checks)
        app.get('/', (req, res) => {
            res.status(200).json({ message: 'AI Study Assistant Backend is running!' });
        });

        // --- 4. Server Start (CRITICAL FIX APPLIED HERE) ---

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
