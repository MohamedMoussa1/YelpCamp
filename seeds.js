const mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

let data = [
  {
    name: "Lake Head",
    image:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
    description:
      ":) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae nunc sed velit dignissim sodales. Viverra tellus in hac habitasse platea. Non sodales neque sodales ut etiam sit amet nisl purus. Ut eu sem integer vitae. Morbi enim nunc faucibus a pellentesque. Donec ac odio tempor orci dapibus ultrices in iaculis nunc. Feugiat nisl pretium fusce id. Est lorem ipsum dolor sit amet consectetur. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Integer eget aliquet nibh praesent tristique magna sit. Odio aenean sed adipiscing diam donec adipiscing tristique. Nibh mauris cursus mattis molestie a iaculis at erat. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Tincidunt dui ut ornare lectus sit amet est placerat. Consequat interdum varius sit amet mattis vulputate enim nulla aliquet. Vitae suscipit tellus mauris a diam. Venenatis cras sed felis eget velit aliquet. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Lacus vel facilisis volutpat est. Aliquam vestibulum morbi blandit cursus risus at. Pharetra massa massa ultricies mi quis. Tortor id aliquet lectus proin nibh nisl condimentum. Libero justo laoreet sit amet cursus sit amet. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Enim lobortis scelerisque fermentum dui faucibus. Elementum sagittis vitae et leo duis ut diam. Sit amet porttitor eget dolor. Commodo viverra maecenas accumsan lacus vel facilisis volutpat.",
  },
  {
    name: "The Forest",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
    description:
      ";) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae nunc sed velit dignissim sodales. Viverra tellus in hac habitasse platea. Non sodales neque sodales ut etiam sit amet nisl purus. Ut eu sem integer vitae. Morbi enim nunc faucibus a pellentesque. Donec ac odio tempor orci dapibus ultrices in iaculis nunc. Feugiat nisl pretium fusce id. Est lorem ipsum dolor sit amet consectetur. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Integer eget aliquet nibh praesent tristique magna sit. Odio aenean sed adipiscing diam donec adipiscing tristique. Nibh mauris cursus mattis molestie a iaculis at erat. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Tincidunt dui ut ornare lectus sit amet est placerat. Consequat interdum varius sit amet mattis vulputate enim nulla aliquet. Vitae suscipit tellus mauris a diam. Venenatis cras sed felis eget velit aliquet. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Lacus vel facilisis volutpat est. Aliquam vestibulum morbi blandit cursus risus at. Pharetra massa massa ultricies mi quis. Tortor id aliquet lectus proin nibh nisl condimentum. Libero justo laoreet sit amet cursus sit amet. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Enim lobortis scelerisque fermentum dui faucibus. Elementum sagittis vitae et leo duis ut diam. Sit amet porttitor eget dolor. Commodo viverra maecenas accumsan lacus vel facilisis volutpat.",
  },
  {
    name: "The Gathering Camp",
    image:
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
    description:
      ":D Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae nunc sed velit dignissim sodales. Viverra tellus in hac habitasse platea. Non sodales neque sodales ut etiam sit amet nisl purus. Ut eu sem integer vitae. Morbi enim nunc faucibus a pellentesque. Donec ac odio tempor orci dapibus ultrices in iaculis nunc. Feugiat nisl pretium fusce id. Est lorem ipsum dolor sit amet consectetur. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Integer eget aliquet nibh praesent tristique magna sit. Odio aenean sed adipiscing diam donec adipiscing tristique. Nibh mauris cursus mattis molestie a iaculis at erat. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque. Tincidunt dui ut ornare lectus sit amet est placerat. Consequat interdum varius sit amet mattis vulputate enim nulla aliquet. Vitae suscipit tellus mauris a diam. Venenatis cras sed felis eget velit aliquet. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Lacus vel facilisis volutpat est. Aliquam vestibulum morbi blandit cursus risus at. Pharetra massa massa ultricies mi quis. Tortor id aliquet lectus proin nibh nisl condimentum. Libero justo laoreet sit amet cursus sit amet. Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Enim lobortis scelerisque fermentum dui faucibus. Elementum sagittis vitae et leo duis ut diam. Sit amet porttitor eget dolor. Commodo viverra maecenas accumsan lacus vel facilisis volutpat.",
  },
];
const seedDB = async () => {
  // Remove All Campgrounds and Comments
  await Campground.deleteMany({});
  console.log("Removed Campgrounds");
  await Comment.deleteMany({});
  console.log("Removed Comments");
  for (seed of data) {
    const campground = await Campground.create(seed);
    console.log("Campground Added");
    // Create a comment
    const comment = await Comment.create({
      text: "Great place, Great staff :). I wish there was internet though XD",
      author: "John",
    });
    campground.comments.push(comment);
    await campground.save();
    console.log("Comment Added");
  }
};
module.exports = seedDB;
