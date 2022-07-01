

module.exports = {
  // LOGGED ??
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },

  // RENDER DASHBOARD SCREEN EACH ACCOUNT
  typeAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      // ADMIN
      if (req.user.userType === 0) {
        return res.render('admin', {
          user: req.user,
        })
      }
      // USER
      else
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },

  // ADMIN ACCOUNT
  adminAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() && req.user.userType == 0) {
      return next();
    }
    return res.redirect('/');
  },

  // USER ACCOUNT
  userAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() && req.user.userType === 1) {
      return next();
    }
    return res.redirect('/');
  },

  // AUTHOR ACCOUNT
  authorAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() && req.user.userType === 2) {
      return next();
    }
    return res.redirect('/');
  },
};
