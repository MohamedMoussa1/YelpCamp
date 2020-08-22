const campground = require("./models/campground");

const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user");

// Connect to DB
mongoose
  .connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // Connects to 'public' folder // YelpCamp/public
seedDB();

// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "Once again",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Called on every route
app.use(function (req, res, next) {
  // Pass req.user to every template
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function (req, res) {
  res.render("landing");
});

// INDEX - Display all campgrounds
app.get("/campgrounds", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });

  //res.render("campgrounds", { campgrounds: campgrounds });
});

// CREATE - Add a new campground
app.post("/campgrounds", function (req, res) {
  //res.send("POST is here");
  // Get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = { name: name, image: image, description: desc };

  Campground.create(newCampground, function (err, newCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
  // Redirect back to campgrounds page
  //res.redirect("/campgrounds");
});

// NEW - Display form to make a new campground
app.get("/campgrounds/new", function (req, res) {
  // Renders form
  res.render("campgrounds/new");
});

// SHOW - Display info about a particular campground
app.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// |==================|
// | Comments Routes  |
// |==================|

// NEW - Comment Form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// Create - Comment
app.post("/campgrounds/:id", isLoggedIn, function (req, res) {
  let newComment = req.body.comment;
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(newComment, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          foundCampground.comments.push(newComment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

// ===========
// AUTH ROUTES
// ===========

// show register form
app.get("/register", function (req, res) {
  res.render("register");
});

// handle sign up logic
app.post("/register", function (req, res) {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

// show login form
app.get("/login", function (req, res) {
  res.render("login");
});

// handle login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// LOGOUT ROUT
app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function () {
  console.log("YelpCamp Server");
});
