// server/routes/api_routes.js (FINAL, WORKING FIX)

import express from 'express';
const router = express.Router();

// 🔑 FINAL FIX: Import ONLY the named functions you need.
// This is the correct structure for files that use 'export const'.
import { generateCurriculum, explainUploadedNotes } from '../controllers/gemini_controller.js';
import { triggerAFL } from '../controllers/wellness_controller.js';
import { loginUser } from '../controllers/auth_controller.js'; 


// --- Routes ---
// The functions are now variables ready to be used as callbacks.

router.post('/curriculum', generateCurriculum);

router.post('/notes-explain', explainUploadedNotes);

router.post('/stress-trigger', triggerAFL);

router.post('/auth/login', loginUser);


// Export the router
export default router;
