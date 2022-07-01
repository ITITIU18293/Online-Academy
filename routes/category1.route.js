const express = require('express');
const categoryModel = require('../models/category1.model');
const router = express.Router();

router.get('/', async function (req, res) {
  const rows = await categoryModel.all();
  res.render('vwCategories1/index', {
    categories: rows,
    empty: rows.length === 0
  });
})

router.get('/add', function (req, res) {
  res.render('vwCategories1/add');

})

router.post('/add', async function (req, res) {
  try {
    const ret = await categoryModel.add(req.body);
    res.status(200).send({'added': true});
  } catch (error) {
    res.status(200).send({'added': false})
  }
})

router.post('/del', async function (req, res) {
  const ret =  await categoryModel.del(req.body);
})

router.post('/patch', async function (req, res) {
  try {
    const ret = await categoryModel.patch(req.body);
    res.status(200).send({'saved': true});
  } catch (error) {
    res.status(200).send({'saved': false})
  }
})

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const category = await categoryModel.single(id);
  if (category === null) {
    return res.redirect('/categories1');
  }

  res.render('vwCategories1/edit', {
    category
  });
})

module.exports = router;