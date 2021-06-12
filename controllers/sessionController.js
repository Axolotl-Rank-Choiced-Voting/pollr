
const models = require("../models/sessionModels");

const sessionController = {};

sessionController.createSession = async (req, res, next) => {
    try {
        const existingSession = await models.Session.find(res.locals.user);
        if (existingSession[0]) {
          next();
        }
        const session = {
            sessionId : res.locals.user,
        };
        models.Session.create(session);
      next();
    }
    catch(err) {
      next({log: 'ERROR from sessionController.createSession',
      message: {err: `Did not create session properly ERROR: ${err}`}})
  };
};

sessionController.isLoggedIn = (req, res, next) => {
    //find a session with sessionId of req.cookies
    try {
      const session = models.Session.find(req.cookies.ssid);
      if(session[0]){
        // res.status(200).sendFile(path.join(__dirname, '../index.html')).send();
        // res.render(path.join(__dirname, '../index.html'), {tabs: home})
        res.locals.isLoggedIn = true;
        next();
      } else {
        console.log('got here')
        next();
      }
    }
    catch(err) {
      next({log: 'ERROR from sessionController.isLoggedIn',
      message: {err: `Did not search for session properly ERROR: ${err}`}})
  };

}



module.exports = sessionController;
