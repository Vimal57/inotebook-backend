const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/Inotebook";

const connectToMongo = () => {
    mongoose.connect(mongoURI)
    .then(() => {
        console.log("Database connected successfully...");
    }).catch(err => {
        console.log("errr in db connection :: ", err);
    })
}

module.exports = connectToMongo;