const db = require("../utils/db");

const TBL_LEARNS = "learnProcess";

module.exports = {
  all() {
    return db.load(`select * from ${TBL_LEARNS}`);
  },

  async byUsernameAndCourseID(username, courseID) {
    try {
      const rows = await db.load(
        `select * from ${TBL_LEARNS} where learnUser = '${username}' and learnCourse = ${courseID}`
      );
      return rows;
    } catch (error) {
      console.log(error);
      return [];
    }
    
  },

  allWithDetails() {
    const sql = `
      select c.*, count(p.courseId) as CourseCount
      from ${TBL_LEARNS} 
    `;
    return db.load(sql);
  },

  async single(id) {
    const rows = await db.load(
      `select * from ${TBL_LEARNS} where catID = '${id}'`
    );
    if (rows.length === 0) return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_LEARNS);
  },

  del(entity) {
    const condition = { catID: entity.catID };
    return db.del(condition, TBL_LEARNS);
  },

  patch(entity) {
    const condition = { catID: entity.catID };
    delete entity.catID;
    return db.patch(entity, condition, TBL_LEARNS);
  },
};
