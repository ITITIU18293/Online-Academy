const db = require('../utils/db');

const TBL_LESSONS = 'lessons';

module.exports = {
    all(id) {
        return db.load(`select * from ${TBL_LESSONS} where courseID = '${id}'`);
    },

    byCourse(courseID) {
        return db.load(`select * from ${TBL_LESSONS} where courseID = ${courseID}`);
    },

    async check_Done(courseID) {
        const rows = await db.load(`SELECT * FROM ${TBL_LESSONS} where courseID = '${courseID}' and done = 0;`);
        if (rows.length === 0)
            return null;
        return rows;
    },

    async single(coursesId, lessonId) {
        const rows = await db.load(`select * from ${TBL_LESSONS} where courseID = '${coursesId}' and lessonID= '${lessonId}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    async getMaxIndex(courseID) {
        const rows = await db.load(`select MAX(lessonID) as maxLesson from ${TBL_LESSONS} where courseID = '${courseID}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    add(entity) {
        return db.add(entity, TBL_LESSONS)
    },

    del(entity) {
        const condition = { courseID: entity.courseID, lessonID: entity.lessonID };
        return db.load(`delete from ${TBL_LESSONS} where courseID = '${condition.courseID}' and lessonID = ${condition.lessonID}`);
    },

    delLessonByCourse(courseID) {
        return db.load(`delete from ${TBL_LESSONS} where courseID = '${courseID}'`);
    },

    patch(entity) {
        const condition1 = { courseID: entity.courseID };
        const condition2 = { lessonID: entity.lessonID };

        delete entity.courseID;
        delete entity.lessonID;
        return db.patchWith2Condition(entity, condition1, condition2, TBL_LESSONS);
    }
};