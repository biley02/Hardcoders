const express = require("express");
const router = express.Router();
const Comment = require("../src/models/Comment");
const Question = require("../src/models/Question");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const authorization = require("../src/middleware/auth");
const slugify = require("slugify");
const User = require("../src/models/User");

router.use(methodOverride("_method"));
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({})
      .sort({
        likes: -1,
      })
      .populate("author");

    res.render("forum", {
      questions: questions,
    });
  } catch (err) {
    console.error(err);
    req.send("Something went wrong. Try again");
    res.redirect("/");
  }
});

router.get("/appreciate/:question_id", authorization, async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);
    let likesArr = user.likes || [];
    let question = await Question.findById(req.params.question_id);
    if (likesArr.includes(question._id)) {
      likesArr.remove(question._id);
      question.likes = question.likes - 1;
    } else {
      likesArr.push(question._id);
      question.likes = question.likes + 1;
    }
    user.likes = likesArr;
    await question.save();
    await user.save();
    console.log(likesArr);
    console.log(question);
    res.redirect(req.get("referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong. Try again");
    res.redirect("/");
  }
});

router.get("/create", authorization, (req, res) => {
  res.render("ask");
});

router.post("/create", authorization, async (req, res) => {
  var cover =
    "https://cdn-images-1.medium.com/max/800/1*fDv4ftmFy4VkJmMR7VQmEA.png";
  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      return;
    }
    const question = req.body;
    // console.log(blog)
    if (!question) {
      req.send("Something went wrong");
    }
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    const saved = await new Question({
      title: question.title,
      slug: (
        slugify(question.title) +
        "-" +
        Math.random().toString(36).substr(2, 8)
      ).toLowerCase(),
      author: req.user.name,
      category: question.category,
      cover: cover,
      body: question.body,
      tags: question.tags,
      queryTime: today,
    }).save();
    if (user.questions) {
      user.questions.push(saved);
    } else {
      user.questions = [saved];
    }
    await user.save();
    res.redirect("/forum");
  } catch (e) {
    console.log(e.message);
    res.send("Something went wrong. Try again");
  }
});

router.get("/view/:id", authorization, async (req, res) => {
  try {
    //find the corresponding question in db
    let slug = req.params.id;

    const question = await Question.findOne({
      _id: slug,
    }).populate("author");

    await question.populate("comments");
    await question.populate("tags");

    //render result page
    res.render("questionDescription", {
      question: question,
    });
  } catch (e) {
    console.log(e.message);
  }
});

//answering to a question (adding comment to the question)
router.post("/answer/:id", authorization, async (req, res) => {
  console.log("hi");
  try {
    //find the corresponding question in db
    let slug = req.params.id;
    if (!slug) {
      res.send("Error page");
    }

    const question = await Question.findOne({
      _id: slug,
    });
    // console.log(question);
    const answer = req.body;
    if (!answer) {
      res.send("something wrong");
      return;
    }
    const saved = await new Comment({
      body: answer.body,
      author: req.user.name,
    }).save();
    if (question.comments) {
      question.comments.push(saved);
    } else {
      question.comments = [saved];
    }
    // console.log(saved);
    await question.save();
    res.redirect(`/forum/view/${question._id}`);
  } catch (e) {
    console.log(e);
    res.send("error");
  }
});

module.exports = router;
