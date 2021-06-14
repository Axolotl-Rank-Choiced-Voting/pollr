const {Session}= require("../models/sessionModels");

const sessionController = {};

sessionController.createSession = async (req, res, next) => {
  try {
    if(!res.locals.id) return next();
    const existingSession = await Session.findOne({
      sessionId: res.locals.id,
    });
    console.log("res.locals.userId: ", res.locals.userId);
    console.log("existing session: ", existingSession ? true : false);
    if(existingSession) {
      res.locals.userId = existingSession.userId;
      return next();
    }
    console.log(res.locals);
    const session = {
      sessionId: res.locals.id,
      userId: res.locals.userId,
    };
    await Session.create(session);
    console.log('created session: ', session.sessionId);
    next();
  } catch (err) {
    next({
      log: "ERROR from sessionController.createSession",
      message: { err: `Did not create session properly ERROR: ${err}` },
    });
  }
};

sessionController.isLoggedIn = async (req, res, next) => {
  //find a session with sessionId of req.cookies
  try {
    if(!req.cookies.ssid) return next();
    const session = await Session.findOne({sessionId: req.cookies.ssid});
    if (session) {
      // res.status(200).sendFile(path.join(__dirname, '../index.html')).send();
      // res.render(path.join(__dirname, '../index.html'), {tabs: home})
      res.locals.isLoggedIn = true;
      res.locals.userId = session.userId;
      return next();
    } else {
      return next();
    }
  } catch (err) {
    return next({
      log: "ERROR from sessionController.isLoggedIn",
      message: { err: `Did not search for session properly ERROR: ${err}` },
    });
  }
};

module.exports = sessionController;
