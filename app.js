const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");
// ROUTES
(commentRoutes = require("./routes/comments")),
  (campgroundRoutes = require("./routes/campgrounds")),
  (indexRoutes = require("./routes/index"));

// Connect to DB

let url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // Connects to 'public' folder // YelpCamp/public
app.use(methodOverride("_method"));
app.use(flash());

// Seed DB
//seedDB();

// Moment
app.locals.moment = require("moment"); // available in all view files via 'moment

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
  res.locals.page = req.url;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Using Route Files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("YelpCamp Server Started");
});
