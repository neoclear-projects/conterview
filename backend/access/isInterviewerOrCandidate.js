"use strict";

module.exports = (req, res, next) => {
  const user = req.session.user;
  if (!user)
    return res.status(401).send('need to login as organization user or interview candidate');
  if(user.type === 'orgUser'){
    if (!req.organization._id.equals(user.organizationId))
      return res.status(403).end('cannot access resource of other organizations');
    for(let interviewer of req.interview.interviewers){
      if(interviewer.equals(user._id)) return next();
    }
    return res.status(403).send('need to be an interviewer of this interview');
  }else{
    if(!req.interview._id.equals(user.interviewId)) return res.status(403).send('need to be the candidate of this interview');
    return next();
  }
};