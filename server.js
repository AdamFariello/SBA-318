const express = require("express");
const app = express();
const PORT = 8000;

const error = require("./middleware/errors");
const videoRoutes = require("./routes/videos");


// Routes 
app.use("/videos", videoRoutes);


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
                rel:"users",
                type:"GET"
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