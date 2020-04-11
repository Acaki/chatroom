const permit = (req, res, next, ...allowed) => {
  const isAllowed = (role) => allowed.indexOf(role) > -1;
  if (req.user && isAllowed(req.user.role)) {
    next();
  } else {
    res.status(403).end();
  }
};

module.exports = permit;
