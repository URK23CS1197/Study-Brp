// server/routes/api_routes.js (FINAL, CRASH-FREE VERSION)

// 1. Import dependencies using standard ESM syntax
import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Use standard, synchronous ESM imports for controllers
// This works because the imported files use 'export default'.
import geminiController from '../controllers/gemini_controller.js';
import wellnessController from '../controllers/wellness_controller.js';
// NOTE: Node now knows that imported 'default' objects are the controllers.


// --- AI and Curriculum Routes ---

// 3. Use the imported controller objects directly
router.post('/curriculum', geminiController.generateCurriculum);

router.post('/notes-explain', geminiController.explainUploadedNotes);

// --- Wellness and AFL Routes ---

router.post('/stress-trigger', wellnessController.triggerAFL);


// 4. Export the router using the ESM standard
export default router;
