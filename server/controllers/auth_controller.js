// server/controllers/auth_controller.js (ESM Compliant and Pool-Safe)

// NOTE: This file assumes the necessary imports (express, etc.) are handled by server.js/routes.

/**
 * Handles user login (TEMPORARY DEMO BYPASS).
 * This function acquires a connection from the pool, attempts a query to stay stable, 
 * but always issues a mock token regardless of the password.
 */
const loginUser = async (req, res) => {
    const pool = req.db; // The PostgreSQL connection pool
    let client; // Declare client outside try block
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // 🔑 CRITICAL FIX 1: Safely acquire a client from the pool (Essential for stability)
        client = await pool.connect(); 

        // 1. Attempt to find the user in the database (This checks if the database connection is alive)
        const userQuery = await client.query(
            'SELECT user_id, display_name FROM users WHERE email = $1', [email || 'test@example.com'] // Use entered email or default
        );
        const user = userQuery.rows[0];

        // 2. Issue Token: We bypass the password check and use the found user, or mock a default user.
        let userToReturn;
        
        if (user) {
            // User found: use their real ID
            userToReturn = { user_id: user.user_id, displayName: user.display_name };
        } else {
            // User not found: mock a default test user
            userToReturn = { user_id: 'mock-test-id-123', displayName: 'Demo Tester' };
        }

        const mockToken = 'mock-jwt-token-' + userToReturn.user_id;

        // 3. Send back success data
        return res.status(200).json({
            token: mockToken,
            user: userToReturn
        });

    } catch (error) {
        console.error("FATAL AUTH CRASH (Returning 500):", error.stack);
        // This is the emergency brake if anything fails (DB query, client release, etc.)
        return res.status(500).json({ error: 'Internal server error during authentication process. Check server logs.' });
    } finally {
        // 🔑 CRITICAL FIX 2: Release the connection and resolve the leak/crash.
        if (client) {
            client.release();
        }
    }
};

// 🔑 FINAL EXPORT: Export the function using the ES Module standard
export default {
    loginUser
};
