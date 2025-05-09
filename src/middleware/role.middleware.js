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
 

  const isUser = (req, res, next) => {
    if (req.user && req.user.who === 'user') {
      return next();
    }
    return res.status(403).json({ status: false, message: 'Access denied. User only.' });
  };
  export { isAdmin, isSupervisor, isUser };