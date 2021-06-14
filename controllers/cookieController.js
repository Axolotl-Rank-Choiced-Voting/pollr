const models = require("../models/pollModels");

const cookieController = {};

cookieController.createCookie = (req, res, next) => {
  try {
    if(res.locals.id) {
      console.log('Set cookie: ', res.locals.id)
      res.cookie("ssid", res.locals.id);
    }
    next();
  } catch (err) {
    next({
      log: "ERROR from cookieController.createCookie",
      message: { err: `Did not set cookie properly ERROR: ${err}` },
    });
  }
};

module.exports = cookieController;
