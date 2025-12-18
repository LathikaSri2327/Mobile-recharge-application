const express = require('express');
const mongoose = require('mongoose');
const Recharge = require('../models/Recharge');
const { authenticateToken, authorize } = require('../middleware/auth');
const { processRecharge } = require('../controllers/rechargeController');
const router = express.Router();

// Create recharge (customers and agents)
router.post('/', authenticateToken, authorize('customer', 'agent'), processRecharge);

// Simple recharge route for testing
router.post('/simple', async (req, res) => {
  try {
    const { phoneNumber, amount, operator, planName } = req.body;
    
    console.log('Recharge request:', { phoneNumber, amount, operator, planName });
    
    // Create a dummy user ID for testing
    const dummyUserId = new mongoose.Types.ObjectId();
    
    const recharge = new Recharge({
      userId: dummyUserId,
      phoneNumber,
      amount: Number(amount),
      operator: operator || 'Unknown',
      planName: planName || 'Basic Plan',
      status: 'completed'
    });
    
    await recharge.save();
    console.log('Recharge saved successfully');
    res.json({ message: 'Recharge successful', recharge });
  } catch (error) {
    console.error('Simple recharge error:', error);
    res.status(500).json({ message: 'Recharge failed', error: error.message });
  }
});

// Get user's recharge history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Customers see only their recharges
    if (req.user.role === 'customer') {
      query.userId = req.user._id;
    }
    // Admins and agents see all recharges
    
    const recharges = await Recharge.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(recharges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin only: Get all recharges
router.get('/admin/all', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const recharges = await Recharge.find()
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.json(recharges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;