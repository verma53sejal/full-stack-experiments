module.exports = function roles(...allowed) {
  const permittedRoles = allowed.map((role) => String(role).trim().toLowerCase());

  return (req, res, next) => {
    const role = String(req.user?.role || '').trim().toLowerCase();
    if (!role) return res.status(403).json({ message: 'Access denied: no role in token' });
    if (!permittedRoles.includes(role)) return res.status(403).json({ message: 'Access denied for this role' });
    next();
  };
};
