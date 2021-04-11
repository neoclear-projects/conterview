"use strict";

module.exports = (req, res, next) => {
  if (!req.session.user || req.session.user.type !== 'orgUser')
    return res.status(401).send('need to login as organization user');
  if (!req.organization._id.equals(req.session.user.organizationId))
    return res.status(403).end('cannot access resource of other organizations');
  for(let interviewer of req.interview.interviewers){
    if(interviewer.equals(req.session.user._id)) return next();
  }
  return res.status(403).send('need to be an interviewer of this interview');
};