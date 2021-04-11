"use strict";

const { validationResult } = require('express-validator');

function handleValidationResult (req, res, next) {
  const result = validationResult(req);
  if(!result.isEmpty()) {
    console.log(result.errors[0].msg);
    return res.status(400).send(result.errors[0].msg);
  }
  next();
}

module.exports = handleValidationResult;