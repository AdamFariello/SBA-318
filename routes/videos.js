const express = require("express");
const router = express.Router();

const videos = require("../data/videos");

router.route("/")
      .get((req, res) => {
        res.json({videos});
      });


module.exports = router;