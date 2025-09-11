const express = require("express");

const app = express();
const PORT = 8000;

const videoRoutes = require("./routes/videos");


// Routes 
app.use("/videos", videoRoutes);


app.listen(PORT, () => {
    console.log(`Server is running at locahost:${PORT}`);
})