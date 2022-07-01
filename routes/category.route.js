const express = require('express');
const categoryModel = require('../models/category.model');
const categoryModel1 = require('../models/category1.model')
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated, adminAuthenticated } = require("./controllers/auth");

const router = express.Router();

router.get('/', adminAuthenticated, async function (req, res) {
  const rows = await categoryModel.all();
  try {
    rows.forEach(async element => {
      const catLevel1 = await categoryModel1.single(element.catLevel1ID);
      element['catLevel1Name'] = catLevel1.catName;
    });
  } catch (error) {

  }
  res.render('vwCategories/index', {
    categories: rows,
    empty: rows.length === 0
  });
})

router.get('/add', adminAuthenticated, async function (req, res) {
  const catLevel1 = await categoryModel1.all();
  res.render('vwCategories/add', {
    catLevel1: catLevel1,
  });
})

router.post('/add', adminAuthenticated, async function (req, res) {
  try {
    const ret = await categoryModel.add(req.body);
    res.status(200).send({ 'added': true });
  } catch (error) {
    res.status(200).send({ 'added': false })
  }
})

router.post('/del', adminAuthenticated, async function (req, res) {
  const ret = await categoryModel.del(req.body);
})

router.post('/patch', adminAuthenticated, async function (req, res) {
  try {
    const ret = await categoryModel.patch(req.body);
    res.status(200).send({ 'saved': true });
  } catch (error) {
    res.status(200).send({ 'saved': false })
  }
})

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const category = await categoryModel.single(id);
  if (category === null) {
    return res.redirect('/categories');
  }

  res.render('vwCategories/edit', {
    category
  });
})

module.exports = router;