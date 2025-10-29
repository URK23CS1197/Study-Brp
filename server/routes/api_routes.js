// server/routes/api_routes.js (GROK AI, ESM, PRODUCTION READY)

import express from 'express';
const router = express.Router();

// GROK AI CONTROLLERS (NO GEMINI!)
import { generateCurriculum, explainUploadedNotes } from '../controllers/grok_controller.js';
import { triggerAFL } from '../controllers/wellness_controller.js';
import { loginUser } from '../controllers/auth_controller.js'; // Grok-powered JWT

// --- API ENDPOINTS ---

/**
 * @route   POST /api/curriculum
 * @desc    Generate personalized learning path using GROK AI
 */
router.post('/curriculum', generateCurriculum);

/**
 * @route   POST /api/notes-explain
 * @desc    Explain uploaded notes (image + question) using GROK Vision
 */
router.post('/notes-explain', explainUploadedNotes);

/**
 * @route   POST /api/stress-trigger
 * @desc    Trigger Affective Feedback Loop: AI break + wellness activity
 */
router.post('/stress-trigger', triggerAFL);

/**
 * @route   POST /api/auth/login
 * @desc    AI-secured login → JWT token (Grok validates intent)
 */
router.post('/auth/login', loginUser);

// Export router
export default router;
