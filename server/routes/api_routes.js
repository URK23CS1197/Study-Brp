// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Use the simple default import (assuming controllers use 'export default { ... }')
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
import authController from '../controllers/auth_controller.js'; 


// --- Routes ---

// FIX: Access the functions directly. Since the import is 'geminiController', 
// this object *is* the controller module, so its functions are properties.

// Line 17 (The crash point)
router.post('/curriculum', geminiController.generateCurriculum); 

// Line 19
router.post('/notes-explain', geminiController.explainUploadedNotes);

// Line 22
router.post('/stress-trigger', wellnessController.triggerAFL);

// Line 25
router.post('/auth/login', authController.loginUser);


// Export the router
export default router;
