const express = require('express');
const courseModel = require('../models/course.model');
const categoriesModel = require('../models/category.model');
const watchListModel = require('../models/watchList.model');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('./controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, async (req, res) => {
  try {
    const catMostRegistered = await categoriesModel.mostRegistered();
    const outStandingCourse = await courseModel.outStandingCourse();
    const mostViewedCourse = await courseModel.mostViewedCourse();
    const latestCourse = await courseModel.latestCourse();
    res.render('home', {
      catMostRegistered,
      mostViewedCourse,
      outStandingCourse,
      latestCourse,
      empty: rows.length === 0
    });
  } catch (err) {
    res.send('View error log at server console.');
  }
});

router.post('/updateSidebar', (req, res) => {
  return 1;
})


// Dashboard
router.get('/dashboard', typeAuthenticated, async (req, res) => {
  const catMostRegistered = await categoriesModel.mostRegistered();
  const outStandingCourse = await courseModel.outStandingCourse();
  const mostViewedCourse = await courseModel.mostViewedCourse();
  const latestCourse = await courseModel.latestCourse();
  const favorites = await watchListModel.byUsername(req.session.passport.user.userUsername);

  for (let i = 0; i < outStandingCourse.length; i++) {
    outStandingCourse[i].isFavorite = false;
    for (let j = 0; j < favorites.length; j++) {
      if (outStandingCourse[i].courseID == favorites[j].courseID) {
        outStandingCourse[i].isFavorite = true;
      }
    }
  }

  res.render('home', {
    catMostRegistered,
    outStandingCourse,
    mostViewedCourse,
    latestCourse,
    empty: outStandingCourse.length === 0,
    user: req.user,
  })
}
);

module.exports = router;