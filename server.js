const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

const error = require("./middleware/errors");
const videoRoutes = require("./routes/videos");
const userRoutes = require("./routes/users");


app.use(express.json());                        //TODO: Highlight in notes that you need this
app.use(express.urlencoded({ extended: true })) //      otherwise req.body = undefined
/*
app.use(bodyParser.json());                        //TODO: Highlight in notes that you need this
app.use(bodyParser.urlencoded({ extended: true })) //      otherwise req.body = undefined
*/

// Routes 
//TODO: make it so you need to preface with /api
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);


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

app.get("/api", (req, res) => {
    res.json({
        links: [
        {
            href:"/api/videos",
            rel:"videos",
            type:"GET"
        },
        {
            href: "/api/videos/:id",
            rel: "videos",
            type: "POST",
        }
        ]
    })
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