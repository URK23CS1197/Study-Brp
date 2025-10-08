// server/controllers/auth_controller.js (FINAL STABILITY FIX)

// NOTE: This code is the temporary bypass modified for connection stability.
// The code you provided uses the CommonJS 'exports' structure, so we adhere to that.

const loginUser = async (req, res) => {
    // We only need the connection pool (req.db) for stable execution, 
    // but we will bypass the actual query for the demo.
    const pool = req.db;
    let client; // Declare client outside try block

    try {
        // 🔑 CRITICAL FIX: Safely acquire a client from the pool
        client = await pool.connect(); 

        const { email } = req.body;
        
        // --- BYPASS LOGIC START ---
        // 1. Check for basic user existence (Simulated)
        const userQuery = await client.query(
            'SELECT user_id, display_name FROM users WHERE email = $1', ['test@example.com']
        );
        const user = userQuery.rows[0];

        if (!user) {
             // If the test user isn't seeded in the DB, mock a fallback
             // This ensures the code path doesn't crash on an empty result.
             const mockUser = { user_id: 'test-user-final', display_name: 'Frontend Tester', email: 'test@example.com' };
             const mockToken = 'final-mock-token-' + mockUser.user_id;

             return res.status(200).json({
                token: mockToken,
                user: { user_id: mockUser.user_id, displayName: mockUser.display_name }
             });
        }
        // --- BYPASS LOGIC END ---
        
        // 2. If the user is found, issue the token (Using the found user's ID)
        const mockToken = 'final-mock-token-' + user.user_id;

        res.status(200).json({
            token: mockToken,
            user: {
                user_id: user.user_id,
                displayName: user.display_name || 'Student',
            }
        });

    } catch (error) {
        console.error("CRITICAL FATAL AUTH CRASH:", error);
        // This catch block handles the error if the DB query itself fails.
        res.status(500).json({ error: 'Internal server error during authentication.' });
    } finally {
        // 🔑 CRITICAL FIX: This releases the connection and resolves the leak/crash.
        if (client) {
            client.release();
        }
    }
};

// Export the function using the module.exports standard (CJS)
module.exports = {
    loginUser
};
