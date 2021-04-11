"use strict";

module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.type !== 'orgUser')
    return res.status(401).send('need to login as organization user');
  if (!req.user._id.equals(req.session.user._id))
    return res.status(403).end('cannot update profile of other user');
  return next();
};