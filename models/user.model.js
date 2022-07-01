const db = require('../utils/db');

const TBL_USERS = 'users';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_USERS}`);
  },

  allRegister() {
    return db.load(`select * from ${TBL_USERS} where unchecked = 1`);
  },

  add(entity) {
    return db.add(entity, TBL_USERS)
  },

  del(entity) {
    const condition = { userUsername: entity.userUsername };
    return db.del(condition, TBL_USERS);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_USERS} where userUsername = '${id}' `);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleEmail(id) {
    const rows = await db.load(`select * from ${TBL_USERS} where userEmail = '${id}' `);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(entity) {
    const condition = { userUsername: entity.userUsername };
    delete entity.userUsername;
    console.log(entity);
    return db.patch(entity, condition, TBL_USERS);
  },

  addLecturer(userUsername) {
    return db.load(`update ${TBL_USERS} set unchecked = 0 where userUsername = '${userUsername}'`);
  },

  lecturerByCourse(courseID) {
    return db.load(`select users.* from users join courses on users.userUsername = courses.courseLecturer where courses.courseID = '${courseID}'`);
  },

  async lecturerInfo(username) {
    const rows = await db.load(`
    select sum
    from users
    left join (
	  select count(*) as sum, courseLecturer
	  from courses 
    group by courses.courseLecturer) as c on c.courseLecturer = users.userUsername
    where users.userUsername = '${username}'
    `);

    return rows[0];
  }


};
