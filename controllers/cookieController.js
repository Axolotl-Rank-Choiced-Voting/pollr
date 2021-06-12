
const models = require("../models/pollModels");

const cookieController = {};

cookieController.createCookie = (req, res, next) => {
    try{
      if (res.locals.verified) {
        res.cookie('ssid', res.locals.user);
      }
      next();
    }
    catch(err){
        next({log: 'ERROR from cookieController.createCookie',
        message: {err: `Did not set cookie properly ERROR: ${err}`}})
    };
  };

module.exports = cookieController;
