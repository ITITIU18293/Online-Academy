const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const authMiddleware = require('./routes/controllers/auth');
const app = express();

require('dotenv');
// Passport Config
require('./routes/controllers/passport')(passport);

dotenv.config({path: './.env'});
app.use(express.urlencoded({
  extended: true
}));

// PREVENT CLICK BACK TO PRIVATE ROUTE
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// Express session (luwu thong tin dung chung co cacs req - thong tin dang nhap)
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// STATIC FILE
app.use('/public', express.static('public'));



// MIDDLEWARE
require('./middleware/locals.mdw')(app);
require('./middleware/view.mdw')(app);
require('./middleware/routes.mdw')(app);
require('./middleware/error.mdw')(app);

// START 
const PORT = 3000;
app.listen(PORT, _ => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});