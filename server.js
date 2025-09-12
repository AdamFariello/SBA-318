const express = require("express");
const fs = require("fs");

const error = require("./middleware/errors");
const api = require("./middleware/api");

const videoRoutes = require("./routes/videos");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");

const videos = require("./data/videos");
const users = require("./data/users");
const comments = require("./data/comments")

// Server Setup
const app = express();
const PORT = 8000;
app.use(express.json());                        //TODO: Highlight in notes that you need this
app.use(express.urlencoded({ extended: true })) //      otherwise req.body = undefined



// Server View Engine
// TODO: COVER IN NOTES THAT LIVESERER DOESN'T SUPPORT YOUTUBE VIDEOS
app.set("views", "./pages");
app.set("view engine", "html"); //TODO: check to see how to send CSS scripts
app.engine("html", (filePath, options, callback) => { //TODO: figure if this should be in seperate dir
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);

        let rendered;
        if (options.video1 && options.video2) {
            rendered = content.toString()
                              .replace("#videoOneInsert#", options.video1)
                              .replace("#videoTwoInsert#", options.video2)
                              .replace("#ID#", options.videoID)
        } else if (options.videoID != undefined && options.belief != undefined) {
            let relevantComments = comments.filter(e => {
                return e.videoCompID == options.videoID
            })
            if (relevantComments.length > 0) {
                let randomEntry = Math.round(Math.random() * (relevantComments.length - 1));
                let randomComment = relevantComments[randomEntry];
                const userID = randomComment.comment.userID;
                //console.log(userID);
                //console.log(users);
                //console.log(users[userID]);
                const userName = users[userID].username;

                let belief = null;
                if (options.belief) belief = "(Believer)";
                else belief = "(Doubter)";

                rendered = content.toString()
                                  .replace("#AUTHOR#", `${userName} -- ${belief}`)
                                  .replace("#COMMENT#", randomComment.comment.content)
                                  .replace("#LIKES#", randomComment.likes)
                                  .replace("#DISLIKE#", randomComment.dislikes)
            } else {
                rendered = content.toString()
                                  .replace("#AUTHOR#", "No Author")
                                  .replace("#COMMENT#", "Comment")
                                  .replace("#LIKES#")
                                  .replace("#DISLIKE#")
            }

            
        } else {
            rendered = content.toString();
        }
        return callback(null, rendered);
    });
});


function createYtLink(video) {
    //OPTIONAL: figure out way to reduce url 
    let videoID = video.link.split("/");
    videoID = videoID[videoID.length - 1];
    if (videoID != -1) videoID = videoID.split("watch?v=")[1];

    const timeStamp = video.timestamp;
    return `https://www.youtube.com/embed/${videoID}?&amp;start=${timeStamp}`;
}
//function getTwoRandomVideos()
app.get("/", (req, res) => {
    let video = videos[Math.round(Math.random() * (videos.length))];
    let options = {
        //video1: "https://www.youtube.com/embed/P00HMxdsVZI",
        //video2: "https://www.youtube.com/embed/b8m9zhNAgKs"
        video1: createYtLink(video.video1),
        video2: createYtLink(video.video2),
        videoID: video.id
    };

    res.render("vidComp", options);
});

app.get("/purple", (req, res, next) => {
    if (req.query.videoID != undefined && req.query.belief != undefined) {
        let options = {
            videoID: req.query.videoID,
            belief: req.query.belief
        };
        res.render("comments", options)
    } else next(error(400, "Bad Request"));
})



// Routes 
app.use("/api", api)
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);


// HATEOS links to help with api usage of the site
//TODO: Convert this into a function
app.get("/api", (req, res) => {
    res.json({links: {
    videos : [
        {
            href:"/api/videos",
            rel:"videos",
            types:["GET", "POST"]
        },
        {
            href:"/api/videos/:id",
            rel:"videos",
            types:["GET", "PATCH", "DELETE"]
        },
        {
            href:"/api/videos:id/comments",
            rel:"videos",
            types:["GET"]
        },
    ],
    users: [
        {
            href:"/api/users",
            rel:"users",
            types:["GET", "POST"]
        },
        {
            href:"/api/users/:id",
            rel:"users",
            types:["GET"]
        },
        {
            href:"/api/users/:id/comments",
            rel:"users",
            types:["GET"]
        }
    ],
    comments: [
        {
            href:"/api/comments",
            rel:"comments",
            types:["GET", "POST"]
        }
    ]
    }})
});


// Middleware Error Handling
app.use((req, res, next) => {
    next(error(404, "Resource not found"));
});
app.use((err, req, res, next) => {
    res.status(err.status || 400);
    res.json({error: err.message});
})

app.listen(PORT, () => {
    console.log(`Server is running at locahost:${PORT}`);
})