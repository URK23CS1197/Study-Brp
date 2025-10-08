// server/routes/api_routes.js (FINAL FIX)

// 1. Import dependencies using ESM syntax
import express from 'express';
const router = express.Router();

// 2. Import Controllers using dynamic import
// NOTE: We assume your controllers (gemini, wellness) use module.exports (CJS export).
// If they were converted to "export default", you must change this import style slightly.
const geminiController = await import('../controllers/gemini_controller.js');
const wellnessController = await import('../controllers/wellness_controller.js');


// --- AI and Curriculum Routes ---

// POST /api/curriculum (Maps to generateCurriculum function)
router.post('/curriculum', geminiController.default.generateCurriculum);

// POST /api/notes-explain (Maps to explainUploadedNotes function)
router.post('/notes-explain', geminiController.default.explainUploadedNotes);

// --- Wellness and AFL Routes ---

// POST /api/stress-trigger (Maps to triggerAFL function)
router.post('/stress-trigger', wellnessController.default.triggerAFL);

// 3. Export the router using the ESM standard
export default router;
