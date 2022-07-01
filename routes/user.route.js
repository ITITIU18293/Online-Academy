const express = require("express");
const bcrypt = require('bcrypt');

const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated, adminAuthenticated } = require("./controllers/auth");
const UserModel = require("../models/user.model");
const registedCourseModel = require("../models/registedCourse.model");
const watchListModel = require("../models/watchList.model");
const multer = require("multer");
const reviewModel = require("../models/review.model");
const learnModel = require("../models/learn.model");
const voteModel = require("../models/vote.model");

router.get("/", adminAuthenticated, async function (req, res) {
  const rows = await UserModel.all();
  res.render("vwUsers/index", {
    users: rows,
    empty: rows.length === 0,
  });
});

router.get("/registerLecturer", adminAuthenticated, async function (req, res) {
  const rows = await UserModel.allRegister();

  res.render("vwUsers/indexRegister", {
    users: rows,
    empty: rows.length === 0,
  });
});



router.get("/add", adminAuthenticated, function (req, res) {
  res.render("vwUsers/add");
});

router.post('/add',adminAuthenticated, async function (req, res) {
  try {
    console.log(req.body)
    const {userUsername, userPassword, userDisplayName, userEmail, userType} = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        if (err) throw err;
        UserModel.add({userUsername, userPassword: hash, userDisplayName, userEmail, userType});
      })
    });

    res.status(200).send({ 'added': true });
  } catch (error) {
    res.status(200).send({ 'added': false })
  }
})

router.post('/addLecturer',adminAuthenticated, async function (req, res) {
  try {
    const username = Object.keys(req.body)[0];
    await UserModel.addLecturer(username);
    res.status(200).send({ 'added': true });
  } catch (error) {
    res.status(200).send({ 'added': false })
  }
})

router.post("/del", adminAuthenticated, async function (req, res) {
  const ret = await UserModel.del(req.body);
});

router.post("/patch", async function (req, res) {
  try {
    const ret = await UserModel.patch(req.body);
    res.status(200).send({ 'saved': true });
  } catch (error) {
    res.status(200).send({ 'saved': false })
  }
});

//send vote
router.post("/vote", async function(req, res) {
  let data = {
    voteUser: req.session.passport.user.userUsername,
    voteCourse: req.body.courseID,
    voteValue: req.body.vote
  }
  const rows = await voteModel.add(data);
  res.redirect(`/courses/${req.body.courseID}`);
});

//edit vote
router.post("/editVote", async function(req, res) {
  let data = {
    voteUser: req.session.passport.user.userUsername,
    voteCourse: req.body.courseID,
    voteValue: req.body.vote
  }
  const rows = await voteModel.patch(data);

  let data2 = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
    vote: req.body.vote
  }
  const updateReview = await reviewModel.patch(data2);
  res.redirect(`/courses/${req.body.courseID}`);
});

//send comment
router.post("/sendComment", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
    content: req.body.content,
    vote: req.body.vote,
    dateReview: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  console.log("abc");
  console.log(data);

  const ret = await reviewModel.add(data);

  res.redirect(`/courses/${data.courseID}`);
});

//register a course
router.post("/registerCourse", async function (req, res) {
  try {
    let data = {
      username: req.session.passport.user.userUsername,
      courseID: req.body.courseID,
    };

    const ret = await registedCourseModel.add(data);
    res.redirect(`/courses/${data.courseID}`);
  } catch (error) {
    res.redirect(`/courses/${data.courseID}`);
  }
});

//add a course to watch list
router.post("/addFavorite",  async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
  };
  const ret = await watchListModel.add(data);

  res.redirect(`/courses/${data.courseID}`);
});

//remove a course from watch list
router.post("/removeFavorite", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: +req.body.courseID,
  };
  const ret = await watchListModel.del(data);

  res.redirect("/courses/watchList");
});


router.post('/patch', async function (req, res) {
  try {
    const ret = await UserModel.patch(req.body);
    res.status(200).send({ 'saved': true });
  } catch (error) {
    res.status(200).send({ 'saved': false })
  }
})

// Profile
router.get("/profile", async function (req, res) {
  const info = req.session.passport.user;
  if (info === null) {
    return res.redirect("/");
  }
  let tab = req.query.tab;
  if (tab == null) {
    tab = "general";
  }

  res.render("vwUsers/profile", {
    info: info,
    isGeneralTab: tab == "general",
  });
});

// save avatar
router.post("/profile", function (req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  // upload.single('fuMain')(req, res, function (err) {

  upload.array("fuMain", 1)(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("vwUsers/profile");
    }
  });
});

//save info
router.post("/profile/save", async function (req, res) {
  let info = req.body;

  if (info.userPassword != undefined) {
    const password = info.userPassword;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        info.userPassword = hash;
        info.userUsername = req.session.passport.user.userUsername;
        req.session.passport.user.userPassword = hash;
        req.session.save();
        await UserModel.patch(info);
      });
    });
  }
  else
    await UserModel.patch(info);

  req.session.passport.user.userDisplayName = info.userDisplayName;
  req.session.passport.user.userEmail = info.userEmail;
  req.session.passport.user.userIntro = info.userIntro;
  req.session.save();

  res.redirect("/users/profile");
});

//learning process
router.post("/saveState", async function (req, res) {
  const data = req.body;
  data.learnUser = req.session.passport.user.userUsername;
  try {
    const ret = await learnModel.add(data);
  } catch (error) {
    console.log(error);
  }
  let link = "/courses/learn?courseID=" + data.learnCourse + "&lessonID=" + data.learnLesson + "&unit=" + data.learnUnit;
  console.log(link);
  res.redirect(link);
})

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  const user = await UserModel.single(id);
  if (user === null) {
    return res.redirect("/users");
  }
  res.render("vwUsers/edit", {
    editUser: user,
  });
});

module.exports = router;
