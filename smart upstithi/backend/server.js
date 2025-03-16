const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // ✅ Removed deprecated options
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

// SSL configuration
const privateKey = fs.readFileSync("./server.key", "utf8");
const certificate = fs.readFileSync("./server.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
const IP = process.env.Bankend_IP;


const app = express();

// ✅ Extract port from VITE_BACKEND_IP
const backendURL = new URL(process.env.VITE_BACKEND_IP);
const port = backendURL.port || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_IP || "*" })); // ✅ Fixed case issue
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/faculty");
const studentRoutes = require("./routes/student");
const attendanceRoutes = require("./routes/attendance");
const classroomRoutes = require("./routes/classrooms")
const lectureRoutes = require("./routes/lectures")


app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/classroom", classroomRoutes);
app.use("/api/lectures", lectureRoutes);

app.get("/", (req, res) => res.send("Hello World!"));
// app.post("/detect", upload.single("image"), async (req, res) => {
//   const imagePath = req.file.path;
//   // Send image to YOLOv8 model (Python server or local processing)
// });


// Connect to Database & Start Server
connectDB().then(() => {
  https.createServer(credentials, app).listen(port, () => {
    console.log(`✅ Server is running on ${process.env.VITE_BACKEND_IP}`);
  });
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });


// Create the HTTPS server
// https.createServer(credentials, app).listen(3000, () => {
//   console.log(`Server is running on ${IP}`);
// });