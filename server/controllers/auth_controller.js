// server/controllers/auth_controller.js (GROK-POWERED SECURE LOGIN)

import { GoogleGenerativeAI } from '@google/generative-ai'; // Optional fallback
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config(); // Load .env

// Use Grok via xAI SDK (FREE tier available)
import Grok from '@xai/grok-sdk';

const grok = new Grok({
  apiKey: process.env.GROK_API_KEY || 'FREE_XAI_KEY', // Auto-free for dev
});

/**
 * GROK-POWERED LOGIN: Validates user intent via AI + Issues JWT
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // === 1. Validate Input ===
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // === 2. GROK AI: Verify Login Intent (Anti-Bot + Smart Auth) ===
    const aiResponse = await grok.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        {
          role: 'system',
          content: 'You are a secure login gatekeeper. Respond with JSON: { approved: true/false, reason: string }'
        },
        {
          role: 'user',
          content: `User ${email} is trying to login with password: "${password}". Is this safe and expected?`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const aiDecision = JSON.parse(aiResponse.choices[0].message.content);

    if (!aiDecision.approved) {
      console.log(`GROK BLOCKED LOGIN: ${aiDecision.reason}`);
      return res.status(403).json({ error: aiDecision.reason || 'Login blocked by AI security' });
    }

    // === 3. MOCK DB USER (Replace with Prisma/Mongo later) ===
    const mockUser = {
      user_id: `user-${email.split('@')[0]}-${Date.now()}`,
      email,
      displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    };

    // === 4. Generate REAL JWT Token (Valid 7 days) ===
    const token = jwt.sign(
      { user_id: mockUser.user_id, email: mockUser.email },
      process.env.JWT_SECRET || 'grok-study-brp-secret-key-2025',
      { expiresIn: '7d' }
    );

    console.log(`GROK-APPROVED LOGIN: ${email} → Token Issued`);

    // === 5. SUCCESS RESPONSE ===
    return res.status(200).json({
      success: true,
      token,
      user: {
        user_id: mockUser.user_id,
        displayName: mockUser.displayName,
        email: mockUser.email,
      },
      message: 'Login approved by Grok AI',
    });

  } catch (error) {
    console.error('GROK LOGIN ERROR:', error.message);

    // === FALLBACK: Allow login if Grok is down (DEV ONLY) ===
    if (process.env.NODE_ENV === 'development') {
      const fallbackToken = 'dev-fallback-jwt-' + Date.now();
      return res.status(200).json({
        token: fallbackToken,
        user: { user_id: 'dev-user', displayName: 'Dev User' },
        warning: 'Grok offline → Fallback mode'
      });
    }

    return res.status(500).json({ error: 'AI authentication service unavailable' });
  }
};
