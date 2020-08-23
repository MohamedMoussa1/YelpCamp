const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

// ROOT ROUTE
router.get("/", function (req, res) {
  res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// REGISTER form
router.get("/register", function (req, res) {
  res.render("register");
});

// REGISTER Logic
router.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", user.username + "! Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  });
});

// LOGIN Form
router.get("/login", function (req, res) {
  res.render("login");
});

// LOGIN Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// LOGOUT ROUTE
router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success", "Loggedout Successfully");
  res.redirect("/campgrounds");
});
module.exports = router;
