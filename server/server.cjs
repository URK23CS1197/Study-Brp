// server/server.js - Optimized for Render Deployment

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables (critical for local testing, safe for Render)
dotenv.config();

const apiRoutes = require('./routes/api_routes');

const app = express();
// 🔑 CRITICAL FIX: Use '0.0.0.0' to ensure Render's load balancer detects the service
const HOST = '0.0.0.0'; 
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---

// Configure CORS using the environment variable for the frontend URL
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin })); 

// Allows parsing JSON request bodies (up to 5MB, needed for image base64 upload)
app.use(express.json({ limit: '5mb' })); 

// --- 2. Database Connection Setup ---

const dbClient = new Client({
    connectionString: process.env.DATABASE_URL,
    // Render requires this when connecting from an external service (like your Express app)
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

        // 🔑 FIX: Bind to both PORT and HOST to prevent the 'Timed Out' error on Render
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
