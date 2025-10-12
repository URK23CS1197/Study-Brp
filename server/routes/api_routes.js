// server/routes/api_routes.js (FINAL, WORKING FIX)

// 1. Import dependencies using standard ESM syntax
import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Change import syntax for all controllers.
// We are importing the entire module as an object (e.g., *as geminiModule)
import * as geminiModule from '../controllers/gemini_controller.js';
import * as wellnessModule from '../controllers/wellness_controller.js';
import * as authModule from '../controllers/auth_controller.js'; 


// --- Routes ---

// Now, call the functions using the module name and the property name:

// POST /api/curriculum 
router.post('/curriculum', geminiModule.default.generateCurriculum);

// POST /api/notes-explain
router.post('/notes-explain', geminiModule.default.explainUploadedNotes);

// POST /api/stress-trigger 
router.post('/stress-trigger', wellnessModule.default.triggerAFL);

// POST /api/auth/login
router.post('/auth/login', authModule.default.loginUser);


// 4. Export the router using the ESM standard
export default router;
