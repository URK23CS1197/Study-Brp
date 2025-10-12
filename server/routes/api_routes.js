// server/routes/api_routes.js (FINAL WORKING VERSION)

import express from 'express';
const router = express.Router();

// 1. Import all controllers using the simple default syntax (as defined in your controllers)
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
import authController from '../controllers/auth_controller.js'; 


// --- Routes ---

// The imported object IS the controller module. We access the functions directly.

// POST /api/curriculum (Fixes the TypeError)
router.post('/curriculum', geminiController.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiController.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessController.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authController.loginUser);


// 4. Export the router
export default router;
