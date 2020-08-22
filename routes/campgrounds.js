const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

// INDEX - Display all campgrounds
router.get("/", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add a new campground
router.post("/", isLoggedIn, function (req, res) {
  // Get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCampground = { name: name, image: image, description: desc, author };

  Campground.create(newCampground, function (err, newCampground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - Display form to make a new campground
router.get("/new", isLoggedIn, function (req, res) {
  // Renders form
  res.render("campgrounds/new");
});

// SHOW - Display info about a particular campground
router.get("/:id", function (req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT Campground ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE Campground ROUTE
router.put("/:id", checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY Campground ROUTE
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// Middleware

function checkCampgroundOwnership(req, res, next) {
  // if a user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        // do they own the campground
        if (foundCampground.author.id.equals(req.user._id)) {
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
