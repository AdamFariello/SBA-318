const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

const videos = require("../data/videos");

router.route("/")
      .get((req, res) => {
        const links = [{
            href: "videos/:id",
            rel: ":id",
            type: "GET",
        }];
        res.json({videos});
      });

router.route("/:id") //TODO: highlight that "id" can be replaced w/ anything
      .get((req, res) => {
        const id = req.params.id;
        const videoComp = videos.find(v => v.id == id);
        
        if (videoComp) res.json({videoComp});
        else next(error(400, "User not found")); //res.send("TODO: replace with real error");
      })
module.exports = router;