const categoryModel = require('../models/category.model');
const categoryModel1 = require('../models/category1.model')

module.exports = function (app) {
  app.use(async function (req, res, next) {

    try {
      if (req.session.isActiveSidebar === undefined) {
        req.session.isActiveSidebar = false;
      }

      if (req.body.isActiveSidebar === "active") {
        var c = req.session.isActiveSidebar;
        if (c) {
          req.session.isActiveSidebar = false;
        }
        else
          req.session.isActiveSidebar = true;
      }

      req.session.save();
      res.locals.isActiveSidebar = req.session.isActiveSidebar
      res.locals.user = req.session.passport.user;
      next();
    } catch (error) {
      next();
    }
  })

  app.use(async function (req, res, next) {
    let lcCategories = await categoryModel1.all();
    var resultArray = Object.values(JSON.parse(JSON.stringify(lcCategories)))

    resultArray.forEach(async element => {
      element['catLevel2'] = [];
      const catLevel2 = await categoryModel.allWithDetails(element.catID);
      var resultArray2 = Object.values(JSON.parse(JSON.stringify(catLevel2)));
      element.catLevel2 = resultArray2;
    });
    res.locals.lcCategories = resultArray;
    next();
  })
}