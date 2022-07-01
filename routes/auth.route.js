const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { forwardAuthenticated } = require('./controllers/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {
  layout: false
}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {
  layout: false
}));

// Register
router.post('/register', (req, res) => {
  const { name, email, username, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      err: true,
      errorMsg: errors[0].msg,
      layout: false
    });
  } else {
    User.single(username).then(user => {
      if (user) {
        errors.push({ msg: 'Username already exists' });
        res.render('register', {
          err: true,
          errorMsg: errors[0].msg,
          layout: false
        });
      } else {
        User.singleEmail(email).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              err: true,
              errorMsg: errors[0].msg,
              layout: false
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;

                // User.add({ userUsername: username, userPassword: hash, userType: 1, userEmail: email, userDisplayName: name, isConfirm: false })

                var transporter = nodemailer.createTransport({ // config mail server
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'onlineacademysystem@gmail.com',
                    pass: 'datquadeptrai123'
                  },
                  tls: {
                    rejectUnauthorized: false
                  }
                });

                const token = jwt.sign(
                  { userUsername: username, userPassword: hash, userEmail: email, userDisplayName: name },
                  process.env.JWT_ACCOUNT_ACTIVATION,
                  {
                    expiresIn: '5m'
                  }
                );

                // content of confirm mail
                var content = '';
                content += `
                    <div style="padding: 10px; background-color: #003375">
                        <div style="padding: 10px; background-color: white;">
                            <h1 style="text-align: center">Online Academy</h1>
                            <h3 style="color: #0085ff">Chào mừng bạn đến với hệ thống học trực tuyến Online Academy</h3>
                            <span style="color: black">Click vào link để xác nhận đăng ký tài khoản:</span>
                            http://localhost:3000/auth/confirm?data=` + token + `
                        </div>
                    </div>
                `;

                var mainOptions = {
                  from: 'onlineacademysystem@gmail.com',
                  to: email,
                  subject: 'Test Nodemailer',
                  text: 'Your text is here',
                  html: content
                }

                transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                    console.log(err);
                    res.status(200).send('confirm', {
                      step: 1,
                      sendMail: false
                    })
                  } else {
                    console.log('Message sent: ' + info.response);
                    res.render('confirm', {
                      step: 1,
                      sendMail: true
                    })
                  }
                });
              });
            });
          }
        });
      }
    });
  }
})

router.get('/confirm', (req, res) => {
  const token = req.query.data;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again'
        });
      } else {
        const { userUsername, userPassword, userEmail, userDisplayName, unchecked, userType } = jwt.decode(token);
        if (unchecked == undefined)
          User.add({ userUsername, userPassword, userType: 1, userEmail, userDisplayName })
        else
          User.add({ userUsername, userPassword, userType: 1, userEmail, userDisplayName, unchecked, userType })
        res.render('confirm')
      }
    });
  } else {
    return res.render('500', { layout: false });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

// check username
router.get('/is-available', async function (req, res) {
  const username = req.query.user;
  const user = await User.singleByUsername(username);
  if (user === null) {
    return res.json(true);
  }
  res.json(false);
});

// Register lecturer Page
router.get('/register/registerLecturer', forwardAuthenticated, (req, res) => res.render('registerLecturer', {
  layout: false
}));

// Register lecturer
router.post('/registerLecturer', (req, res) => {
  const { name, email, username, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      err: true,
      errorMsg: errors[0].msg,
      layout: false
    });
  } else {
    User.single(username).then(user => {
      if (user) {
        errors.push({ msg: 'Username already exists' });
        res.render('register', {
          err: true,
          errorMsg: errors[0].msg,
          layout: false
        });
      } else {
        User.singleEmail(email).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              err: true,
              errorMsg: errors[0].msg,
              layout: false
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;

                // User.add({ userUsername: username, userPassword: hash, userType: 1, userEmail: email, userDisplayName: name, isConfirm: false })

                var transporter = nodemailer.createTransport({ // config mail server
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'onlineacademysystem@gmail.com',
                    pass: 'datquadeptrai123'
                  },
                  tls: {
                    rejectUnauthorized: false
                  }
                });

                const token = jwt.sign(
                  { userUsername: username, userPassword: hash, userEmail: email, userDisplayName: name, unchecked: 1, userType: 2 },
                  process.env.JWT_ACCOUNT_ACTIVATION,
                  {
                    expiresIn: '5m'
                  }
                );

                // content of confirm mail
                var content = '';
                content += `
                    <div style="padding: 10px; background-color: #003375">
                        <div style="padding: 10px; background-color: white;">
                            <h1 style="text-align: center">Online Academy</h1>
                            <h3 style="color: #0085ff">Chào mừng bạn đến với hệ thống học trực tuyến Online Academy</h3>
                            <span style="color: black">Click vào link để xác nhận đăng ký tài khoản:</span>
                            http://localhost:3000/auth/confirm?data=` + token + `
                        </div>
                    </div>
                `;

                var mainOptions = {
                  from: 'onlineacademysystem@gmail.com',
                  to: email,
                  subject: 'Test Nodemailer',
                  text: 'Your text is here',
                  html: content
                }

                transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                    console.log(err);
                    res.status(200).send('confirm', {
                      step: 1,
                      sendMail: false
                    })
                  } else {
                    console.log('Message sent: ' + info.response);
                    res.render('confirm', {
                      step: 1,
                      sendMail: true
                    })
                  }
                });
              });
            });
          }
        });
      }
    });
  }
})

// check password
router.post('/checkPass', async function (req, res) {
  const password = req.body.password;

  bcrypt.compare(password, req.session.passport.user.userPassword, (err, isMatch) => {
    if (err) throw err;
    if (isMatch) {
      return res.json(true);
    } 
    return res.json(false);
  });
})


module.exports = router;