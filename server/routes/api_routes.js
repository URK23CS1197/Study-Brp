// server/routes/api_routes.js

// 1. Convert require to import for Express
import express from 'express';
const router = express.Router();

// 2. Convert internal controller requires to imports
// NOTE: These files (gemini_controller.js, etc.) must also use module.exports for now.
const geminiController = require('../controllers/gemini_controller.js');
const wellnessController = require('../controllers/wellness_controller.js');
// Ensure ALL internal file requires include the .js extension for ESM environment.

// --- AI and Curriculum Routes ---

// POST /api/curriculum (Maps to generateCurriculum function)
router.post('/curriculum', geminiController.generateCurriculum);

// POST /api/notes-explain (Maps to explainUploadedNotes function)
router.post('/notes-explain', geminiController.explainUploadedNotes);

// --- Wellness and AFL Routes ---

// POST /api/stress-trigger (Maps to triggerAFL function)
router.post('/stress-trigger', wellnessController.triggerAFL);

// --- Progress Routes ---
// POST /api/activity-complete (Example using the controller logic)
// router.post('/activity-complete', progressController.completeActivity); 

// 3. Convert module.exports to export default
export default router;
