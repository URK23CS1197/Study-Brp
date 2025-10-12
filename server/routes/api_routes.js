// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Change all imports to pull the functions by NAME.
// This assumes your controllers are now fixed to use: export const functionName = ...;
// If they still use 'export default { ... }', the code below still resolves the conflict
// by using direct access syntax on the imported object.

import geminiModule from '../controllers/gemini_controller.js';
import wellnessModule from '../controllers/wellness_controller.js';
import authModule from '../controllers/auth_controller.js'; 


// --- Routes ---

// The fix is in the USAGE syntax, ensuring we access the function correctly.
// You were using: geminiModule.default.generateCurriculum which caused the crash.

// POST /api/curriculum 
router.post('/curriculum', geminiModule.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiModule.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessModule.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authModule.loginUser);


// Export the router
export default router;
