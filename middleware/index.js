const Comment = require("../models/comment"),
  Campground = require("../models/campground");

// All Middleware
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = async (req, res, next) => {
  // if a user is logged in
  if (req.isAuthenticated()) {
    const foundCampground = await Campground.findById(req.params.id).catch(
      (e) => {
        req.flash("error", "Campground Not Found");
        res.redirect("back");
      }
    );
    // do they own the campground
    if (foundCampground.author.id.equals(req.user._id)) {
      next();
    } else {
      req.flash("error", "Permission Denied");
      res.redirect("back");
    }
  } else {
    req.flash("error", "Login Required");
    res.redirect("/login");
  }
};

middlewareObj.checkCommentOwnership = async (req, res, next) => {
  // if a user is logged in
  if (req.isAuthenticated()) {
    const foundComment = await Comment.findById(req.params.comment_id).catch(
      (e) => {
        req.flash("error", "Comment Not Found");
        res.redirect("back");
      }
    );
    // do they own the comment
    if (foundComment.author.id.equals(req.user._id)) {
      next();
    } else {
      req.flash("error", "Permission Denied");
      res.redirect("back");
    }
  } else {
    req.flash("error", "Loggin Required");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Login Required");
  res.redirect("/login");
};

module.exports = middlewareObj;
