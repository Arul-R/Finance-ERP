const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'your-super-secret-jwt-key' } = process.env;

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('JWT_SECRET:', JWT_SECRET);
    console.log('Token:', token);
    
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Verified token:', verified);
    
    req.user = verified;
    next();
  } catch (error) {
    console.error('Auth error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(401).json({ 
      message: 'Token verification failed, authorization denied',
      error: error.message 
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('Checking role. User:', req.user);
    console.log('Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: insufficient permissions',
        userRole: req.user.role,
        requiredRoles: roles
      });
    }
    next();
  };
};

module.exports = { auth, checkRole };