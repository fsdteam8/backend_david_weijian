// Middleware for admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.who === 'admin') {
      return next();
    }
    return res.status(403).json({ status: false, message: 'Access denied. Admins only' });
  };
  
  // Middleware for supervisor
  const isSupervisor = (req, res, next) => {
    if (req.user && req.user.who === 'supervisor') {
      return next();
    }
    return res.status(403).json({ status: false, message: 'Access denied. Supervisors or Admins only.' });
  };
  
  // Middleware for user
  const isUserOrAbove = (req, res, next) => {
    if (req.user && req.user.who === 'user') {
      return next();
    }
    return res.status(403).json({ status: false, message: 'Access denied. Users or above only.' });
  };
  
  export { isAdmin, isSupervisor, isUserOrAbove };
  