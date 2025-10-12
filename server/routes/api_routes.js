// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 1. Import all modules using the import * as syntax
import * as geminiModule from '../controllers/gemini_controller.js';
import * as wellnessModule from '../controllers/wellness_controller.js';
import * as authModule from '../controllers/auth_controller.js'; 


// --- Routes ---

// FIX: We access the function directly as a property of the imported module object.

// POST /api/curriculum (Fixes Line 19)
router.post('/curriculum', geminiModule.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiModule.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessModule.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authModule.loginUser);


// Export the router
export default router;
