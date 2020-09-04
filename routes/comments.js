const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// NEW - Comment Form
router.get("/new", middleware.isLoggedIn, async (req, res) => {
  const campground = await Campground.findById(req.params.id).catch((e) => {
    console.log(e);
  });
  res.render("comments/new", { campground: campground });
});

// CREATE - Comment
router.post("/", middleware.isLoggedIn, async (req, res) => {
  const foundCampground = await Campground.findById(req.params.id).catch(
    (e) => {
      console.log(e);
      req.flash("error", "Something went wrong :(");
      res.redirect("/campgrounds");
    }
  );
  newComment = await Comment.create(req.body.comment).catch((e) => {
    console.log(e);
  });
  // Add author id and username to comment
  newComment.author.id = req.user._id;
  newComment.author.username = req.user.username;
  // Save comment
  newComment.save();
  foundCampground.comments.push(newComment);
  foundCampground.save();
  req.flash("success", "Comment Created Successfully");
  res.redirect("/campgrounds/" + foundCampground._id);
});

// EDIT
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  async (req, res) => {
    const foundComment = await Comment.findById(req.params.comment_id).catch(
      (e) => {
        console.log(e);
        res.redirect("back");
      }
    );
    res.render("comments/edit", {
      campground_id: req.params.id,
      comment: foundComment,
    });
  }
);

// UPDATE
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    await Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment
    ).catch((e) => {
      res.redirect("back");
    });
    res.redirect("/campgrounds/" + req.params.id);
  }
);

// DESTROY
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    await Comment.findByIdAndRemove(req.params.comment_id).catch((e) => {
      res.redirect("back");
    });
    req.flash("success", "Comment Deleted");
    res.redirect("/campgrounds/" + req.params.id);
  }
);
module.exports = router;
