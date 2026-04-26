const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const getFallbackResponse = (input) => {
  const lowerInput = (input || '').toLowerCase();

  if (!lowerInput) {
    return "I'm here to help with elderly care! Ask me about medications, appointments, exercise, nutrition, or safety.";
  }

  if (lowerInput.includes('medication') || lowerInput.includes('medicine') || lowerInput.includes('pill')) {
    return "For medication management, use a daily dose planner, set reminders, and keep a log sheet. Consult a doctor before changing medication.";
  }

  if (lowerInput.includes('appointment') || lowerInput.includes('doctor') || lowerInput.includes('visit')) {
    return "Maintain a medical calendar, set reminders the day before and one hour before, and prepare your questions in advance.";
  }

  if (lowerInput.includes('exercise') || lowerInput.includes('walk') || lowerInput.includes('physical')) {
    return "Light walking, chair exercises, and stretching are safe for elderly care. Start slow, and consult a physician if uncertain.";
  }

  if (lowerInput.includes('diet') || lowerInput.includes('nutrition') || lowerInput.includes('food')) {
    return "Eat balanced meals with lean proteins, vegetables, fruits, whole grains, and hydrate regularly. Avoid excessive salt and sugar.";
  }

  return "Here are general elderly care tips: regular checkups, balanced nutrition, gentle exercise, home safety, and staying hydrated. Ask me for more details on a specific topic.";
};

router.post('/ask', auth, (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  const answer = getFallbackResponse(prompt);
  return res.json({ answer });
});

module.exports = router;
