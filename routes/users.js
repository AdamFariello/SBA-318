const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

let users = require("../data/users");
let comments = require("../data/comments");


router.route("/")
      .get((req,res) => {
        res.json({users});
      })
      .post((req,res,next) => {
        if (req.body.username && req.body.email) {
            if (users.find(u => u.username == req.body.username) == undefined) {
                const user = {
                    id: users.length,
                    username: req.body.username,
                    email: req.body.email
                }
                users.push(user);
                res.json({user});    
            } else {
                next(error(409, "Username Already Taken"));
            }
        } else {
            next(error(400, "Insufficient Data"));
        }
      })
      ;

router.route("/:id")
      .get((req, res, next) => {
        let user = users.find(u => u.id == req.params.id);
        
        if (user) res.json({user});
        else next(error(404, "Couldn't find user"));
      })

router.route("/:id/comments")
      .get((req,res,next) => {
        let user = users.find(u => u.id == req.params.id);
        if (user) {
            let commentList = comments.filter(c => {
                //TODO: highlight the need of using "return" for objects
                return c.comment.userID != req.params.id;
            })

            if (commentList) res.json({user, commentList});
            else next(error(404, "Couldn't find user")); 
        } else { 
            next(error(404, "Couldn't find user"));
        }
      })

module.exports = router;