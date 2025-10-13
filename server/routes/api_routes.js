// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Import only the NAMED functions you need.
// This resolves the "does not provide an export named 'default'" error.
import { generateCurriculum, explainUploadedNotes } from '../controllers/gemini_controller.js';
import { triggerAFL } from '../controllers/wellness_controller.js';
import { loginUser } from '../controllers/auth_controller.js'; 


// --- Routes ---
// FIX: The functions are now imported directly as variables, ready to be used as callbacks.

router.post('/curriculum', generateCurriculum);

router.post('/notes-explain', explainUploadedNotes);

router.post('/stress-trigger', triggerAFL);

router.post('/auth/login', loginUser);


// Export the router
export default router;
