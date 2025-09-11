const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

let comments = require("../data/comments");

router.route("/")
      .get((req, res) => {
        res.json({comments});
      })
      .post((req,res,next) => {
        /*
        {
            "videoCompID": 0,
            "userID": 1,
            "content": "Absolutely has to be the same!",
            "likes": 50,
            "dislikes": 3,
            "belivesTheySame": true
        }
        */
        console.log(`
            ${req.body.test}
            ${req.body.videoCompID}
            ${req.body.comment} 
            {req.body.userID}
            {req.body.content}
            ${req.body.likes} 
            ${req.body.dislikes} 
            ${req.body.belivesTheySame}
        `);

        if (req.body.videoCompID != undefined && req.body.comment != undefined 
            && req.body.likes != undefined && req.body.dislikes != undefined 
            && req.body.belivesTheySame ) {
                //NOTE: no checks being added since you can post duplicates
                let newComment = {
                    id: comments.length,
                    videoCompID: req.body.videoCompID,
                    
                    //TODO: figure out how to properly handle
                    /*
                    comment: {
                        userID: req.body.id,
                        content: req.body.content
                    }
                    */
                   comment: req.body.comment,
                    
                    likes: req.body.likes || 0,
                    dislikes: req.body.dislikes || 0,
                    belivesTheySame: req.body.belivesTheySame
                }
                
                comments.push(newComment);
                res.json(newComment);
        } else {
            next(error(400, "Insufficient data"))
        }
        
        })

      ;

module.exports = router;