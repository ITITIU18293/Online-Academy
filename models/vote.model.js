
const db = require('../utils/db');

const TBL_VOTES = 'votes';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_VOTES}`);
  },

  async countVote(courseID) {
    const row = await db.load(`select count(voteCourse) as amount from ${TBL_VOTES} where voteCourse = '${courseID}'`);
    return row[0].amount;
  },

  async avgVote(courseID) {
    const row = await db.load(`select avg(voteValue) as point from ${TBL_VOTES} where voteCourse = '${courseID}'`);
    return row[0].point;
  },
  
  add(entity) {
    return db.add(entity, TBL_VOTES)
  },

  del(entity) {
    const condition = { userUsername: entity.userUsername };
    return db.del(condition, TBL_VOTES);
  },

  async single(username, courseID) {
    const rows = await db.load(`select * from ${TBL_VOTES} where voteCourse = '${courseID}' and voteUser = '${username}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(entity) {
    const condition1 = { voteUser: entity.voteUser };
    const condition2 = { voteCourse: entity.voteCourse};
    delete entity.voteUser;
    delete entity.voteCourse;
    return db.patchWith2Condition(entity, condition1, condition2, TBL_VOTES);
  }
};
