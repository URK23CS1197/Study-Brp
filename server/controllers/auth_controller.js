// server/controllers/auth_controller.js

// NOTE: You would need to install and use a library like 'bcryptjs' 
// for hashing and comparing passwords securely.

/**
 * Handles user login, checks credentials against the PostgreSQL DB, 
 * and issues a temporary JWT token.
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const client = req.db;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // 1. Check user existence in the database
        const userQuery = await client.query('SELECT user_id, email, password_hash, display_name FROM users WHERE email = $1', [email]);
        const user = userQuery.rows[0];

        if (!user) {
            // User not found
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 2. Validate Password (Simplified for Hackathon/Testing)
        // In a real app, you would use bcrypt.compare(password, user.password_hash)
        const isPasswordValid = (password === 'testpass'); // <-- MOCK CHECK for quick testing

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Generate a Mock JWT Token (CRITICAL for frontend protection)
        const mockToken = 'mock-jwt-token-' + user.user_id;

        // 4. Send back success data (Frontend stores token and user_id)
        res.status(200).json({
            token: mockToken,
            user: {
                user_id: user.user_id,
                email: user.email,
                displayName: user.display_name || 'Student',
            }
        });

    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ error: 'Server authentication failed.' });
    }
};
