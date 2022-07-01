const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const FacebookStrategy = require('passport-facebook').Strategy;

// Load User model
const User = require('../../models/user.model');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match user
      User.single(username.toString())
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That account is not registered' });
          }

          if(user.unchecked === 1) {
            return done(null, false, { message: 'That account is not registered' });
          }
          // if (password == user.userPassword)
          //   return done(null, user);
          // else
          //   return done(null, false, { message: 'Password incorrect' });
          //Match password
          bcrypt.compare(password, user.userPassword, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
    })
  );

  

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
