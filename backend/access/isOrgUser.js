module.exports = (req, res, next) => {
  if (!req.organization._id.equals(req.session.user.organizationId))
    return res.status(403).end('access only allowed for organization user');
  return next();
};