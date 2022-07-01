const db = require("../utils/db");

const TBL_REVIEWS = "reviews";

module.exports = {
  all() {
    return db.load(`select * from ${TBL_REVIEWS}`);
  },

  async countReviews(courseID) {
    const row = await db.load(
      `select count(courseID) as amount from ${TBL_REVIEWS} where courseID = '${courseID}'`
    );
    return row[0].amount;
  },

  async avgVote(courseID) {
    const row = await db.load(
      `select avg(vote) as point from ${TBL_REVIEWS} where courseID = '${courseID}'`
    );
    return row[0].point;
  },

  add(entity) {
    return db.add(entity, TBL_REVIEWS);
  },

  del(entity) {
    const condition = { userUsername: entity.userUsername };
    return db.del(condition, TBL_REVIEWS);
  },

  async single(id) {
    const rows = await db.load(
      `select * from ${TBL_REVIEWS} where courseID = '${id}' `
    );
    if (rows.length === 0) return null;

    //handle time
    if (rows == null) {
    } else {
      rows.forEach((row) => {
        //handle time
        let seconds = Math.round(
          Math.abs((new Date() - row.dateReview) / 1000)
        );
        seconds = seconds - 7 * 60 * 60;
        let minutes = 0,
          hours = 0,
          days = 0,
          months = 0,
          years = 0;
        row.dateReview = seconds + " giây";
        if (seconds >= 60) {
          minutes = Math.round(seconds / 60);
          row.dateReview = minutes + " phút";
        }
        if (minutes >= 60) {
          hours = Math.round(minutes / 60);
          row.dateReview = hours + " giờ";
        }
        if (hours >= 24) {
          days = Math.round(hours / 24);
          row.dateReview = days + " ngày";
        }
        if (days >= 30) {
          months = Math.round(days / 30);
          row.dateReview = months + " tháng";
        }
        if (months >= 12) {
          years = Math.round(months / 12);
          row.dateReview = years + " năm";
        }
      });
    }

    return rows;
  },

  patch(entity) {
    const condition1 = { username: entity.username };
    const condition2 = { courseID: entity.courseID };
    delete entity.username;
    delete entity.courseID;
    return db.patchWith2Condition(entity, condition1, condition2, TBL_REVIEWS);
  },
};
