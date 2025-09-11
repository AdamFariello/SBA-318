const express = require("express");

const app = express();
const PORT = 8000;

const videoRoutes = require("./routes/videos");


// Routes 
app.use("/videos", videoRoutes);


//Default HATEOS link
app.get("/", (req, res) => {
    //res.send("GET test");
    res.json({
        lins: [{
            href:"/api",
            rel: "api",
            type:"GET"
        }]
        
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at locahost:${PORT}`);
})