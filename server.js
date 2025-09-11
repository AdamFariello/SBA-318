const express = require("express");
const fs = require("fs");

const error = require("./middleware/errors");
const api = require("./middleware/api");

const videoRoutes = require("./routes/videos");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");

// Server Setup
const app = express();
const PORT = 8000;
app.use(express.json());                        //TODO: Highlight in notes that you need this
app.use(express.urlencoded({ extended: true })) //      otherwise req.body = undefined



// Server View Engine
app.set("views", "./pages");
app.set("view engine", "html"); //TODO: check to see how to send CSS scripts
app.engine("html", (filePath, options, callback) => { //TODO: figure if this should be in seperate dir
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);

        let rendered = content.toString();
        //if (options.title) {

        return callback(null, rendered);
    });
});
app.get("/", (req, res) => {
    let options = {};
    res.render("vidComp", options);
});



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