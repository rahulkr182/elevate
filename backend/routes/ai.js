const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash'
});

router.post('/', async (req, res) => {
  const { calories, protein, goal } = req.body;

  // Mock response if API key is not configured
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key missing. Returning mocked advice.');
    return res.json({ 
      advice: `[Mock AI] You've consumed ${calories} kcal and ${protein}g protein today. To reach your goal, try to balance your macronutrients and stay hydrated! (Add your OpenAI API key to unlock real advice).` 
    });
  }

  const prompt = `
  User goal: ${goal}
  Calories consumed: ${calories}
  Protein consumed: ${protein}

  Give short actionable fitness advice.
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ advice: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ advice: 'Error generating AI advice. Please try again later.' });
  }
});

module.exports = router;
