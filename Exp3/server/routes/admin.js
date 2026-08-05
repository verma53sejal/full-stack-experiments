const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');
const User = require('../models/User');
const Post = require('../models/Post');
const Activity = require('../models/Activity');

router.get('/stats', authMiddleware, roles('Admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const adminCount = await User.countDocuments({ role: 'Admin' });
    const editorCount = await User.countDocuments({ role: 'Editor' });
    const viewerCount = await User.countDocuments({ role: 'Viewer' });
    res.json({ totalUsers, totalPosts, adminCount, editorCount, viewerCount });
  } catch (err) { next(err) }
});

router.get('/activities', authMiddleware, roles('Admin'), async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
    res.json(activities);
  } catch (err) { next(err) }
});

module.exports = router;
