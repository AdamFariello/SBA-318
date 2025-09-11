const express = require("express");
const router = express.Router();
const error = require("../middleware/errors");

let users = require("../data/users");


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


module.exports = router;