module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.type !== 'orgUser')
    return res.status(401).end('need to login as organization user');
  if (!req.organization._id.equals(req.session.user.organizationId))
    return res.status(403).end('cannot access resource of other organizations');
  return next();
};