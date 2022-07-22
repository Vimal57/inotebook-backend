const connectToMongo = require("./db");
const express = require("express");
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");

// connecting with database
connectToMongo();

app.get("/", (req, res) => {
    res.send("Hello Boys!");
})
// Use of Routes
app.use("/auth", authRoutes);


// Connecting server with port
app.listen(port, () => {
    console.log(`Server listening on port :: `, port);
});