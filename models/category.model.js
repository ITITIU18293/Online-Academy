const db = require('../utils/db');

const TBL_CATEGORIES = 'categoriesLevel2';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },

  mostRegistered() {
    const sql = `
    SELECT sum(courses.courseRegistered) AS RES, cat.catName, cat.catID
    FROM categoriesLevel2 cat left join courses courses on cat.catID = courses.courseCatLevel2ID
    group by catID 
    ORDER BY RES DESC LIMIT 5
    `;
    return db.load(sql);
  },

  allWithDetails(cat1) {
    const sql = `
    select c2.*, count(p.courseID) as ProductCount
    from categoriesLevel2 c2 left join courses p on c2.catID = p.courseCatLevel2ID
	  where c2.catLevel1ID = '${cat1}'
    group by c2.CatID, c2.CatName, c2.catLevel1ID
    `;
    return db.load(sql);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_CATEGORIES} where catID = '${id}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_CATEGORIES)
  },

  del(entity) {
    const condition = { catID: entity.catID };
    return db.del(condition, TBL_CATEGORIES);
  },

  patch(entity) {
    const condition = { catID: entity.catID };
    delete entity.catID;
    return db.patch(entity, condition, TBL_CATEGORIES);
  }
};
