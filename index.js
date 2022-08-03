const connectToMongo = require("./db");
const express = require("express");
const app = express();
const cors = require('cors')
const port = 5000;
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");

// using cors
app.use(cors());

// connecting with database
connectToMongo();

// for parse json data which will come from req.body
app.use(express.json());

// Use of Routes
app.use("/user", authRoutes);
app.use("/note", noteRoutes);


// Connecting server with port
app.listen(port, () => {
    console.log(`Server listening on port :: `, port);
});