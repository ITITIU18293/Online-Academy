const db = require("../utils/db");

const TBL_REGISTED = "registed";
const TBL_COURSES = 'courses';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_REGISTED}`);
  },

  async countStudents(courseID) {
    const row = await db.load(`select count(courseID) as amount from ${TBL_REGISTED} where courseID = '${courseID}'`);
    return row[0].amount;
  },

  byUsername(username) {
    return db.load(`select * 
                    from ${TBL_REGISTED} r join ${TBL_COURSES} c on c.courseID = r.courseID
                    where username = '${username}'`);
  },

  add(entity) {
    return db.add(entity, TBL_REGISTED);
  },

  del(entity) {
    const condition = {
      userUsername: entity.userUsername,
      courseID: entity.courseID
    };
    return db.del(condition, TBL_REGISTED);
  },

  async single (username, courseID) {
    const rows = await db.load(
      `select * 
        from ${TBL_REGISTED}
        where username = '${username}' and courseID = '${courseID}' `
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
};
