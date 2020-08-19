const campground = require("./models/campground");

const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment");

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
app.get("/campgrounds/:id/comments/new", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// Create - Comment
app.post("/campgrounds/:id", function (req, res) {
  let newComment = req.body.comment;
  console.log(newComment);
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
app.listen(3000, function () {
  console.log("YelpCamp Server");
});
