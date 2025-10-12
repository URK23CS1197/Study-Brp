// server/routes/api_routes.js (FINAL FIX for Mismatch)

// 1. Import dependencies using standard ESM syntax
import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Use NAMED IMPORTS to access functions directly from the controller.
// NOTE: This assumes your controllers (gemini, wellness) use 'export default { ... }' 
// as their final export, which is what we established.
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
import authController from '../controllers/auth_controller.js'; // Ensure this is imported too


// --- Routes ---

// The controller objects (geminiController, wellnessController) are the *actual modules*, 
// so we access the functions as properties on the imported object.

// POST /api/curriculum 
router.post('/curriculum', geminiController.generateCurriculum);

// POST /api/notes-explain 
router.post('/notes-explain', geminiController.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessController.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authController.loginUser);


// 4. Export the router using the ESM standard
export default router;
