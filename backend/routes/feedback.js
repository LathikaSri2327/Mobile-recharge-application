const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback:', req.body);
    const feedback = new Feedback(req.body);
    await feedback.save();
    console.log('Feedback saved successfully');
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all feedback (admin only)
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;