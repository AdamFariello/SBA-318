const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

const videos = require("../data/videos");

router.route("/")
      .get((req, res) => {
        res.json({videos});
      })
      .post((req, res, next) => {
        let video1 = req.body.videoOne;
        let video2 = req.body.videoTwo;

        

        console.log("test");
        if (video1 && video2) {
         
            res.json("good");
        }
      })
      ;

/*
//time
let re = regExp("&t=.*")
&t=

https://www.youtube.com/watch?v=Fkxlf_cKuEY
https://www.youtube.com/watch?v=Fkxlf_cKuEY&t=428s
*/

router.route("/:id") //TODO: highlight that "id" can be replaced w/ anything
      .get((req, res) => {
        const id = req.params.id;
        const videoComp = videos.find(v => v.id == id);
        
        if (videoComp) res.json({videoComp});
        else next(error(400, "User not found")); //res.send("TODO: replace with real error");
      })
module.exports = router;