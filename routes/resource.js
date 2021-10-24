const express = require("express");
const router = express.Router();
const Comment = require("../src/models/Comment");
const Resource = require("../src/models/Resource");
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
    const resources = await Resource.find({})
      .sort({
        likes: -1,
      })
      .populate("author");
    console.log(resources);
    res.render("resource_new", {
      resources: resources,
    });
  } catch (err) {
    console.error(err);
    req.send("Something went wrong. Try again");
    res.redirect("/");
  }
});

router.post("/create", authorization, async (req, res) => {
  var cover =
    "https://cdn-images-1.medium.com/max/800/1*fDv4ftmFy4VkJmMR7VQmEA.png";
  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      return;
    }
    const resource = req.body;

    if (!resource) {
      req.send("Something went wrong");
    }
    const saved = await new Resource({
      title: resource.title,
      slug: (
        slugify(resource.title) +
        "-" +
        Math.random().toString(36).substr(2, 8)
      ).toLowerCase(),
      author: req.user.userId,
      category: resource.category,
      cover: cover,
      body: resource.body,
      tags: resource.tags,
      url: resource.url,
    }).save();

    res.redirect("/resource");
  } catch (e) {
    console.log(e.message);
    res.send("Something went wrong. Try again");
  }
});

router.get("/view/:id", authorization, async (req, res) => {
  try {
    //find the corresponding question in db
    let slug = req.params.id;
    if (!slug) {
      res.send("Error page");
    }

    const resource = await Resource.findOne({
      _id: slug,
    }).populate("author");

    await resource.populate("comments");
    await resource.populate("tags");
    if (!resource) {
      res.send("error");
    }
    //render result page
    res.render("viewresource", {
      user: req.user,
      resource: resource,
      link: resource.url,
    });
  } catch (e) {
    console.log(e.message);
    req.send("Something went wrong. Try again");
  }
});

//answering to a question (adding comment to the question)
router.post("/comment/:id", authorization, async (req, res) => {
  try {
    //find the corresponding question in db
    let slug = req.params.id;
    if (!slug) {
      res.send("Error page");
    }

    const resource = await Resource.findOne({
      _id: slug,
    });
    // console.log(resource);
    const comment = req.body;
    if (!comment) {
      res.send("something wrong");
      return;
    }
    const saved = await new Comment({
      body: comment.body,
      author: req.user.name,
    }).save();
    if (resource.comments) {
      resource.comments.push(saved);
    } else {
      resource.comments = [saved];
    }
    console.log(saved);
    // console.log(resource.comments);
    await resource.save();
    res.redirect(req.get("referer"));
  } catch (e) {
    console.log(e);
    res.send("error");
  }
});

router.get("/like/:resource_id", authorization, async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);
    let likesArr = user.resourcelikes || [];
    let resource = await Resource.findById(req.params.resource_id);
    // console.log(user);
    console.log(resource._id);

    if (likesArr.includes(resource._id)) {
      likesArr.remove(resource._id);
      resource.likes = resource.likes - 1;
    } else {
      likesArr.push(resource._id);
      resource.likes = resource.likes + 1;
    }
    user.resourcelikes = likesArr;
    await resource.save();
    await user.save();
    console.log(resource);
    res.redirect(req.get("referer"));
  } catch (error) {
    console.log(error);
    res.redirect("/resource");
  }
});
module.exports = router;
