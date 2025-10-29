// server/server.js - FINAL GROK-POWERED, RENDER-OPTIMIZED, CRASH-PROOF

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { config } from 'dotenv';
import apiRoutes from './routes/api_routes.js';

// Load .env
config();

const app = express();
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({
  origin: '*', // Allow all (adjust in prod if needed)
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For base64 images

// --- DATABASE POOL (Render + SSL Safe) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render auto-handles SSL → no need to force
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// --- START SERVER WITH DB CHECK ---
async function startServer() {
  try {
    // Verify DB connection
    const client = await pool.connect();
    console.log('PostgreSQL connected via pool');
    client.release();

    // Attach DB to all requests
    app.use((req, res, next) => {
      req.db = pool;
      next();
    });

    // --- ROUTES ---
    app.use('/api', apiRoutes);

    // Health Check
    app.get('/', (req, res) => {
      res.json({
        message: 'Study-Bro Backend LIVE with GROK AI',
        ai: 'Grok-2-Latest',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
      });
    });

    // 404 Handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error('UNHANDLED ERROR:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // --- LISTEN ---
    app.listen(PORT, HOST, () => {
      console.log(`GROK SERVER RUNNING @ http://localhost:${PORT}`);
      console.log(`Deployed on Render: https://your-app.onrender.com`);
    });

  } catch (err) {
    console.error('FATAL: Failed to start server', err);
    process.exit(1);
  }
}

// Start
startServer();
