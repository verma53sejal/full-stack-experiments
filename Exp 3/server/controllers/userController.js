const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['Admin', 'Editor', 'Viewer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();
    try { await Activity.create({ actor: req.user.userId, actorName: req.user.email, action: `changed role to ${role}`, targetType: 'User', targetId: user._id }); } catch(e){}
    res.json({ message: 'Role updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.remove();
    try { await Activity.create({ actor: req.user.userId, actorName: req.user.email, action: 'deleted user', targetType: 'User', targetId: user._id }); } catch(e){}
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
