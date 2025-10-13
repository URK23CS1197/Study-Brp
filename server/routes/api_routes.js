// server/routes/api_routes.js (FINAL, STABLE FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Import the entire module as a single object (default export)
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
import authController from '../controllers/auth_controller.js'; 


// --- Routes ---

// We access the functions directly as properties of the imported object.
// This matches the 'export default { func1, func2 }' in the controller files.

router.post('/curriculum', geminiController.generateCurriculum);

router.post('/notes-explain', geminiController.explainUploadedNotes);

router.post('/stress-trigger', wellnessController.triggerAFL);

router.post('/auth/login', authController.loginUser);


// Export the router
export default router;
