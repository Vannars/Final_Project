//These are middlewear functions - they ares designed to check login status and define the user who is logged in by using session data
const redirectLogin = (req, res, next) => {
    /// just a cheeky shorthand function to check if the user is logged in
    if (!req.session.userId) {
      // if not (by session id)
      res.redirect("/users/login"); // redirect to login page
    } else {
      next(); 
    };
  };
  
  const setUser = (req, res, next) => {
    res.locals.user = req.session.userId
   ? { id: req.session.userId, username: req.session.username }
      : null;
    next();
  };
  
  module.exports = { redirectLogin, setUser};
  