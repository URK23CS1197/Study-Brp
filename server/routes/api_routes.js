// server/routes/api_routes.js

const express = require('express');
const router = express.Router();

const geminiController = require('../controllers/gemini_controller');
const wellnessController = require('../controllers/wellness_controller');

// --- AI and Curriculum Routes ---

// POST /api/curriculum (Maps to generateCurriculum function)
router.post('/curriculum', geminiController.generateCurriculum);

// POST /api/notes-explain (Maps to explainUploadedNotes function)
router.post('/notes-explain', geminiController.explainUploadedNotes);

// --- Wellness and AFL Routes ---

// POST /api/stress-trigger (Maps to triggerAFL function)
router.post('/stress-trigger', wellnessController.triggerAFL);

// --- Progress Routes (Example) ---
// Note: For a hackathon, simple progress updates can be handled via direct POST/PUT 
// and calculated in the controller, as dedicated database triggers are complex to set up quickly.
// router.post('/activity-complete', progressController.completeActivity); 


module.exports = router;