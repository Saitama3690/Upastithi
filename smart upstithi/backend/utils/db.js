const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://704parthmishra:upstithi3690@upstithi.nzyz4.mongodb.net/Student_Attendance?retryWrites=true&w=majority&appName=upstithi ";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
};

module.exports = connectToMongo;

