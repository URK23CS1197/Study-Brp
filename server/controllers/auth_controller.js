// server/controllers/auth_controller.js (TEMPORARY BYPASS FIX)

// 🔑 FINAL FIX: Convert file to ES Module standard
// NOTE: We assume this file is now named auth_controller.js
// If your server is running in ESM mode, we must convert the exports.

// Define the function using const instead of exports.
const loginUser = async (req, res) => {
    // ❌ REMOVED: Database query and password hash check.
    
    // 1. Get user info from the request body (for logging)
    const { email } = req.body;
    
    // 2. Generate the Mock Data
    const mockUserId = 'test-user-' + Date.now().toString().slice(-4);
    const mockToken = 'final-mock-token-' + mockUserId;

    // 3. Send back success data immediately (CRITICAL: Must be valid JSON)
    console.log(`BYPASS SUCCESS: Issuing token for user: ${email || 'guest'}`);
    
    return res.status(200).json({
        token: mockToken,
        user: {
            user_id: mockUserId,
            displayName: 'Frontend Tester',
        }
    });
};

// NOTE: You would define any other auth functions here (like registerUser)

// 🔑 FINAL FIX: Export the function using the ES Module standard
export default {
    loginUser
};
