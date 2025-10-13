// server/controllers/auth_controller.js (FINAL, CRASH-FREE BYPASS)

/**
 * Handles user login (TEMPORARY DEMO BYPASS).
 * This function completely ignores the database and immediately issues a mock token.
 * It is defined as a NAMED EXPORT to satisfy the router's import { loginUser } request.
 */
export const loginUser = async (req, res) => {
    // 1. Log the attempt but skip the database logic
    const { email } = req.body;
    
    // 2. Generate the Mock Data based on the input email
    const mockUserId = 'mock-test-id-' + Math.random().toString().slice(-4);
    const mockDisplayName = email ? email.split('@')[0] : 'Demo User';
    const mockToken = 'final-mock-token-' + mockUserId;
    
    console.log(`LOGIN BYPASS ACTIVATED. ISSUING TOKEN for: ${email || 'guest'}`);

    // 3. Send back success data immediately (CRITICAL: Must be valid JSON)
    return res.status(200).json({
        token: mockToken,
        user: {
            user_id: mockUserId,
            displayName: mockDisplayName,
        }
    });
};

// ❌ REMOVED: export default { loginUser }; 
// The function is now exported directly using 'export const'.
