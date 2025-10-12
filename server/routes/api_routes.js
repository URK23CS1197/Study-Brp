// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Change all imports to the '* as Module' pattern.
// This resolves the Node runtime confusion by loading all exports under a specific object name.
import * as geminiModule from '../controllers/gemini_controller.js';
import * as wellnessModule from '../controllers/wellness_controller.js';
import * as authModule from '../controllers/auth_controller.js'; 


// --- Routes ---

// Now, access the functions using the module name and the property name:

// POST /api/curriculum (The crash point)
// You need to access the function as: geminiModule.default.generateCurriculum
router.post('/curriculum', geminiModule.default.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiModule.default.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessModule.default.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authModule.default.loginUser);


// Export the router
export default router;
