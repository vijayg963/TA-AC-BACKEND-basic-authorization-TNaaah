const express = require("express");
const { unwatchFile } = require("fs");
const router = express.Router();
const multer = require("multer");
const { freemem } = require("os");
const path = require("path");
const auth = require("../middelwares/auth");
const Podcast = require("../models/podcast");
const podcast = require("../models/podcast");
const User = require("../models/users");
const uploadPath = path.join(__dirname, "../public/uploads/");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
//Render all the podcasts  on the podcasts routes
// render form to add podcasts
router.get("/", auth.isUserLoggedIn, async (req, res) => {
  try {
    if (req.user.isadmin) {
      return res.redirect("/podcasts/dashboard");
    }
    let userId = req.session.userId;
    let user = await User.findById(userId);
    // if the user plan is free
    if (user.Plan === "free") {
      let podcasts = await Podcast.find({ podcastplan: "free" }).populate(
        "userId"
      );
      return res.render("podcasts", { podcasts: podcasts });
    }
    // if the user plan is vip
    if (user.Plan === "vip") {
      let podcasts = await Podcast.find(
        { podcastplan: "free" },
        { podcastplan: "vip" }
      ).populate("userId");
      return res.render("podcasts", { podcasts: podcasts });
    }
    // if the user plan is premium
    if (user.Plan === "premium") {
      let podcasts = await Podcast.find({}).populate("userId");
      return res.render("podcasts", { podcasts: podcasts });
    }
  } catch (err) {
    console.log("Getting an error in the in  the main homepage of the podcast");
    res.redirect("/");
  }
});
router.get("/new", auth.isverified, (req, res) => {
  res.render("addpodcast");
});
// add products post request  to create a collection
router.post(
  "/",
  auth.isverified,
  auth.isUserLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      req.body.image = req.file.filename;
      req.body.userId = req.session.userId;
      let product = await Podcast.create(req.body);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
);

//if the user is admin
router.get("/dashboard", async (req, res) => {
  try {
    if (!req.user.isadmin) {
      res.redirect("/podcasts");
    }
    let podcasts = await Podcast.find({}).populate("userId");
    let podcastPlan = req.query.userplan;

    // if the user wants to know about all the users
    if (req.query.alluser === "users") {
      console.log("getting inside this one");
      let users = await User.find({});
      return res.render("adminDashboard", {
        users: users,
        podcasts: undefined,
      });
    }

    // if the admin wants the  to filter out all the free podcasts
    if (podcastPlan === "free") {
      let podcasts = await Podcast.find({ podcastplan: "free" }).populate(
        "userId"
      );
      return res.render("adminDashboard", {
        podcasts: podcasts,
        users: undefined,
      });
    }

    // if the admin wants to filter out all the vip podcasts
    if (podcastPlan === "vip") {
      let podcasts = await Podcast.find({ podcastplan: "vip" }).populate(
        "userId"
      );
      return res.render("adminDashboard", {
        podcasts: podcasts,
        users: undefined,
      });
    }

    // if  the admin wants   to filter  out all the premium podcasts
    if (podcastPlan === "premium") {
      let podcasts = await Podcast.find({ podcastplan: "premium" }).populate(
        "userId"
      );
      return res.render("adminDashboard", {
        podcasts: podcasts,
        users: undefined,
      });
    }
    // show all the podcast for the first time to the admin until the admin
    //filter  the products
    res.render("adminDashboard", { podcasts: podcasts, users: undefined });
  } catch (err) {
    res.redirect("/podcasts/dashboard");
  }
});

// Verify  the user so he can poat an podcast
// podcast/dashboard/<%= cv._id%>/verfiyuser
router.get("/dashboard/:userid/verifyuser", async (req, res) => {
  try {
    let userId = req.params.userid;
    let user = await User.findByIdAndUpdate(
      userId,
      { isverified: true },
      { new: true }
    );
    console.log("this is the updated user guyzzz" + user);
    res.redirect("/podcasts/dashboard");
  } catch (err) {
    res.redirect("podcasts/dashboard?alluser=users");
  }
});

// get a form to edit  the podcast
router.get("/:id/edit", async (req, res) => {
  try {
    let id = req.params.id;
    let podcast = await Podcast.findById(id);
    res.render("editpodcast", { podcast: podcast });
  } catch (err) {
    red.redirect("/podcasts/dashboard");
  }
});

//now edit  the podcast
router.post("/:id/edit", upload.single("image"), async (req, res) => {
  try {
    console.log("Getting inside to  edit  the podcast");
    let id = req.params.id;
    req.body.image = req.file.filename;
    req.body.userId = req.session.userId;
    let updatePodcast = await Podcast.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.redirect("/podcasts/dashboard");
  } catch (err) {
    console.log(req.body);
    res.redirect("/podcasts/dashboard");
  }
});

// delete the podcast
router.get("/:id/delete", async (req, res) => {
  try {
    let id = req.params.id;
    let podcast = await Podcast.findByIdAndDelete(id, { new: true });
    res.redirect("/podcasts/dashboard");
  } catch (err) {
    red.redirect("/podcasts/dashboard");
  }
});

module.exports = router;
