const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require("../middleware");

// INDEX - Display all campgrounds
router.get("/", async (req, res) => {
  const allCampgrounds = await Campground.find({}).catch((e) => {
    console.log(e);
  });
  res.render("campgrounds/index", { campgrounds: allCampgrounds });
});

// CREATE - Add a new campground
router.post("/", middleware.isLoggedIn, async (req, res) => {
  // Get data from form and add to campgrounds array
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author,
  };

  await Campground.create(newCampground).catch((e) => {
    console.log(e);
  });
  res.redirect("/campgrounds");
});

// NEW - Display form to make a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  // Renders form
  res.render("campgrounds/new");
});

// SHOW - Display info about a particular campground
router.get("/:id", async (req, res) => {
  const foundCampground = await Campground.findById(req.params.id)
    .populate("comments")
    .exec()
    .catch((e) => {
      console.log(e);
    });
  res.render("campgrounds/show", { campground: foundCampground });
});

// EDIT Campground ROUTE
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id).catch(
      (e) => {
        console.log(e);
      }
    );
    res.render("campgrounds/edit", { campground: foundCampground });
  }
);

// UPDATE Campground ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, req.body.campground).catch(
    (e) => {
      res.redirect("/campgrounds");
    }
  );

  res.redirect("/campgrounds/" + req.params.id);
});

// DESTROY Campground ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  await Campground.findByIdAndRemove(req.params.id).catch((e) => {
    req.flash("Something went wrong :(");
    res.redirect("/campgrounds");
  });
  req.flash("success", "Campground Deleted Successfuly");
  res.redirect("/campgrounds");
});
module.exports = router;
