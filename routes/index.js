const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// REGISTER form
router.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER Logic
router.post("/register", async (req, res) => {
  let newUser = new User({ username: req.body.username });
  const user = await User.register(newUser, req.body.password).catch((e) => {
    res.render("register", { error: e.message });
  });
  passport.authenticate("local")(req, res, function () {
    req.flash("success", user.username + "! Welcome to YelpCamp");
    res.redirect("/campgrounds");
  });
});

// LOGIN Form
router.get("/login", (req, res) => {
  res.render("login");
});

// LOGIN Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  })
);

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "See you later");
  res.redirect("/campgrounds");
});
module.exports = router;
