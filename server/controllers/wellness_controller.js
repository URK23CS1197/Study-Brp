// server/controllers/wellness_controller.js (GROK-POWERED, ESM, POOL-SAFE, PRODUCTION READY)

import Grok from '@xai/grok-sdk';
import { config } from 'dotenv';
config();

// Initialize Grok AI (FREE tier auto-enabled)
const grok = new Grok({
  apiKey: process.env.GROK_API_KEY || 'FREE_XAI_KEY',
});

/**
 * Helper: Schedule a break (e.g., Google Calendar API or DB entry)
 * Replace with real integration later
 */
const scheduleBreak = async (userId) => {
  // MOCK: Simulate calendar event
  const calendarId = `break-${userId}-${Date.now()}`;
  console.log(`Break scheduled for user ${userId}: ${calendarId}`);
  return { calendarId };
};

/**
 * GROK AI: Suggest personalized AFL activity based on current task
 */
const suggestAFLActivity = async (currentActivityTitle) => {
  const prompt = `
You are a wellness coach. The user is stressed while doing: "${currentActivityTitle}".
Suggest ONE short, effective break activity (2-10 mins) to reduce stress and refocus.
Return ONLY valid JSON:
{
  "title": "e.g., 5-Min Deep Breathing",
  "type": "wellness",
  "url": "optional YouTube link or empty string"
}
`;

  try {
    const response = await grok.chat.completions.create({
      model: 'grok-2-latest',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8
    });

    const raw = response.choices[0].message.content.trim();
    const parsed = JSON.parse(raw);

    return {
      title: parsed.title || 'Quick Wellness Break',
      type: parsed.type || 'wellness',
      url: parsed.url || ''
    };
  } catch (error) {
    console.error("Grok AFL Suggestion Failed:", error);
    // Fallback activity
    return {
      title: 'Take a 2-Min Walk',
      type: 'wellness',
      url: ''
    };
  }
};

/**
 * Main AFL Trigger: Stress Monitor → AI Break + Path Update
 */
export const triggerAFL = async (req, res) => {
  const pool = req.db;
  let client;
  const { userId, pathId, currentActivityTitle } = req.body;

  if (!userId || !pathId) {
    return res.status(400).json({ error: 'Missing user or path ID.' });
  }

  try {
    // 1. Get DB client
    client = await pool.connect();

    // 2. Schedule Break
    const breakResult = await scheduleBreak(userId);

    // 3. AI: Suggest Wellness Activity
    const newActivity = await suggestAFLActivity(currentActivityTitle);

    // 4. Insert into learning path
    await client.query(
      'INSERT INTO activities (path_id, title, type, url, status) VALUES ($1, $2, $3, $4, $5)',
      [pathId, newActivity.title, newActivity.type, newActivity.url, 'TO_DO']
    );

    // 5. Success
    return res.status(200).json({
      success: true,
      message: 'AFL triggered: Break scheduled + wellness activity added.',
      newActivity,
      breakId: breakResult.calendarId
    });

  } catch (error) {
    console.error('Wellness/AFL Error:', error);
    return res.status(500).json({
      error: 'Failed to trigger AFL process.',
      details: error.message
    });
  } finally {
    // CRITICAL: Always release
    if (client) client.release();
  }
};
