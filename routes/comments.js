const comment = require("../models/comment");

const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment");

// NEW - Comment Form
router.get("/new", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// CREATE - Comment
router.post("/", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          // Add author id and username to comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // Save comment
          newComment.save();
          foundCampground.comments.push(newComment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

// EDIT
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

// UPDATE
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Middleware

function checkCommentOwnership(req, res, next) {
  // if a user is logged in
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // do they own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
