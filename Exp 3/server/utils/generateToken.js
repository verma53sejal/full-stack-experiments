const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

module.exports = generateToken;
