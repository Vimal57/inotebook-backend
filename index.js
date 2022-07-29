const connectToMongo = require("./db");
const express = require("express");
const app = express();
const port = 3000;
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");

// connecting with database
connectToMongo();

// for parse json data which will come from req.body
app.use(express.json());

// Use of Routes
app.use("/user", authRoutes);


// Connecting server with port
app.listen(port, () => {
    console.log(`Server listening on port :: `, port);
});