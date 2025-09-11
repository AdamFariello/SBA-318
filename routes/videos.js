const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

const videos = require("../data/videos");

//TODO: check if it needs to be asycn

//Taken from:
//https://stackoverflow.com/questions/19377262/regex-for-youtube-url
//Didn't think of the idea of checking for "youtu.be" 
const ytRE = RegExp("(www\.youtube\.com|youtu\.be)\/.+$");
const ytTimeRE = RegExp("&t=.*");
let reSearch = (re, s) => re.exec(s);

const ytTimeNumRE = /\D/g;
let reFiltNum = (s) => s.replaceAll(ytTimeNumRE, ""); 

router.route("/")
      .get((req, res) => {
        res.json({videos});
      })
      .post((req, res, next) => {
        let video1 = req.body.videoOne;
        let video2 = req.body.videoTwo;

        //TODO: put in a function outside of this
        if (reSearch(ytRE, video1) && reSearch(ytRE, video2)) {
            let timestamp1 = reSearch(ytTimeRE, video1);
            if (timestamp1) timestamp1 = reFiltNum(timestamp1[0]);

            let timestamp2 = reSearch(ytTimeRE, video2);
            if (timestamp2) timestamp2 = reFiltNum(timestamp2[0]);
            
            let video = {
                "id": videos.length,
                "video1": {
                    "link": video1,
                    "timestamp": timestamp1 || "0"
                },
                "video2": {
                    "link": video2,
                    "timestamp": timestamp2 || "0"
                }
            };
            res.json({video});
        } else {
            next(error(409, "Insufficent Data, or inproperly formatted url"));
        }
      })
      ;


router.route("/:id") //TODO: highlight that "id" can be replaced w/ anything
      .get((req, res, next) => {
        const id = req.params.id;
        const videoComp = videos.find(v => v.id == id);
        
        if (videoComp) res.json({videoComp});
        else next(error(400, "User not found")); //res.send("TODO: replace with real error");
      })
      .patch((req, res, next) => { //TODO: add search paramater for if person only chaning one thing
        const videoEntry = videos.find((v,i) => {
            if (v.id == req.params.id) {
                for (let video in req.body) {
                    for (let key in req.body[video]) {
                        videos[i][video][key] = req.body[video][key];
                    }
                }
                return true;
            }
        })

        if (videoEntry) res.json(videoEntry);
        else next();
      })
      
module.exports = router;