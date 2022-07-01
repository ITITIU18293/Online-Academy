const express = require('express');
const router = express.Router();
const courseModel =require('../models/course.model');
 
router.get('/', function(req, res) {
    res.render('vwCourses/author_courses');
})

//Nho xoa 
router.get('/courses', async(req, res) => {
    const lecturerName =   res.locals.user.userUsername;
    try {
        const rows = await courseModel.all_lecturer(lecturerName);
        rows.forEach(item => {
            let temp = new Date(item.courseUpdatedAt);

            var today = temp;
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = dd+'-'+mm+'-'+yyyy;

            item.dateupdate = today;
        })

        res.render('vwCourses/author_courses', {
            courses: rows,
            empty: rows.length === 0
        });
    } catch (err) {
        console.log(err);
        res.send('View error log at server console.');
    }

});



router.get('/courses', async(req, res) => {
    const lecturerName = 'user';
    try {
        const rows = await courseModel.all_lecturer(lecturerName);
        console.log(rows);
        res.render('vwCourses/author_courses', {
            courses: rows,
            empty: rows.length === 0
        });
    } catch (err) {
        console.log(err);
        res.send('View error log at server console.');
    }

});


module.exports = router;