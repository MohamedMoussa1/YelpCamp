const Comment = require("../models/comment"),
  Campground = require("../models/campground");

// All Middleware
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  // if a user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        req.flash("error", "Campground Not Found");
        res.redirect("back");
      } else {
        // do they own the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission Denied");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Login Required");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
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
          req.flash("error", "Permission Denied");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Loggin Required");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Login Required");
  res.redirect("/login");
};

module.exports = middlewareObj;
