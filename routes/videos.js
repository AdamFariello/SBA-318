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
            
            console.log(`${video1} \n ${timestamp1}`);
            console.log(`${video2} \n ${timestamp2}`);

        } else {
            next(error(409, "Insufficent Data, or inproperly formatted url"));
        }
      })
      ;


/*
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