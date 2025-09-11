const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

const error = require("./middleware/errors");
const api = require("./middleware/api");

const videoRoutes = require("./routes/videos");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");


app.use(express.json());                        //TODO: Highlight in notes that you need this
app.use(express.urlencoded({ extended: true })) //      otherwise req.body = undefined


// Routes 
//TODO: make it so you need to preface with /api
app.use("/api", api)
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);



// HATEOS
app.get("/", (req, res) => {
    //res.send("GET test");
    res.json({
        links: [{
            href:"/api",
            rel: "api",
            type:"GET"
        }]
    })
})

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