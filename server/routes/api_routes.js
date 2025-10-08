// server/routes/api_routes.js (FINAL, CRASH-FREE VERSION)

// 1. Import dependencies using standard ESM syntax
import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Import controllers using default imports
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
// NOTE: We assume you have a similar import for authController too.


// --- AI and Curriculum Routes ---

// The controller object (geminiController) is the *actual module*, 
// so we access functions directly as properties.

// POST /api/curriculum 
router.post('/curriculum', geminiController.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiController.explainUploadedNotes);

// --- Wellness and AFL Routes ---

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessController.triggerAFL);


// 🔑 Add the Auth Route needed for login to work
// Assuming you completed auth_controller.js with an ESM export
import authController from '../controllers/auth_controller.js'; 
router.post('/auth/login', authController.loginUser);


// 4. Export the router using the ESM standard
export default router;
