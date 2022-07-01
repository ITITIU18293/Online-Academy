const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('./controllers/auth');

// Welcome Page
router.get('/account', (req, res) => {
    res.render('home');
})

module.exports = router;