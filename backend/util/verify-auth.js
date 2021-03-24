module.exports = (req, res, next) => {
  if (!req.session.username)
    return res.status(401).end('access denied');
  return next();
};
