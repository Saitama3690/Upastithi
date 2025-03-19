const express = require("express");
const router = express.Router();
const LECTURES = require("../models/Lectures");
const User = require("../models/Faculty")
const Classroom = require("../models/Classrooms");
const fetchuser = require("../middleware/fetchuser"); // Middleware to verify token
const mongoose = require("mongoose");





// ✅ 1️⃣ Add a New Lecture
router.post("/addlecture", async (req, res) => {
  try {
    const { FacultyID, Branch, Semester, Division, Subjects, TypeOfLecture } = req.body;
    console.log("Received Data:", req.body); // Log request body

    // Validate input
    if (!FacultyID || !Branch || !Semester || !Division || !Subjects) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create a new lecture document
    const newLecture = new LECTURES({
      Branch,
      Division,
      FacultyID,
      Semester,
      TypeOfLecture,
      Subjects
    });

    // Save to database
    await newLecture.save();

    res.status(201).json({ success: true, message: "Lecture added successfully", data: newLecture });

  } catch (error) {
    console.error("Error adding lecture:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});





router.get("/branches", async (req, res) => {
  try {
    const userId = req.query.facultyID;
    // const userId = req.user?._id; // Assuming user ID is stored in req.user after authentication
    console.log("authority backend", userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    console.log("authorised access ho gaya")

    const branches = await LECTURES.distinct("Branch", {FacultyID: userId }); // Fetch branches where the facultyId matches
    console.log("ye he tumhari branches", branches)
    res.status(200).json(branches);
  } catch (error) {
    console.error("❌ Error fetching branches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get semesters by branch
router.get("/semesters", async (req, res) => {
  try {
      const { branch } = req.query;
      if (!branch) return res.status(400).json({ message: "Branch is required" });

      const semesters = await LECTURES.find({ Branch: branch }).distinct("Semester");
      res.status(200).json(semesters);
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get divisions by semester
router.get("/divisions", async (req, res) => {
  try {
    const { branch, semester } = req.query;

    // Validate required parameters
    if (!branch || !semester) {
      return res.status(400).json({ message: "Branch and Semester are required" });
    }

    // Fetch distinct divisions for the given branch and semester
    const divisions = await LECTURES.find({ Branch: branch, Semester: semester }).distinct("Division");

    if (!divisions.length) {
      return res.status(404).json({ message: "No divisions found for the given branch and semester" });
    }

    res.status(200).json({ success: true, divisions });

  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
});


router.get("")



















router.get("/fetch-Everything", fetchuser, async (req, res) => {
  try {
    const facultyID = req.user.id; // Extract faculty ID from token

    // Convert facultyID string to ObjectId
    const lectures = await LECTURES.find({ FacultyID: facultyID} );

    if (!lectures || lectures.length === 0) {
      return res.status(404).json({ message: "No lectures found for this faculty." });
    }

    res.status(200).json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/subjects", async (req, res) => {
  try {
    const { branch, semester, division } = req.query;

    if (!branch || !semester || !division) {
      return res.status(400).json({ error: "Branch, semester, and division are required" });
    }

    console.log("Received Request:", branch, semester, division);

    // Fetch distinct subjects
    const subjects = await LECTURES.find({ Branch: branch, Semester: semester, Division: division }).distinct("Subjects");

    console.log("Subjects Found:", subjects);

    if (!subjects.length) {
      return res.status(404).json({ message: "No subjects found for the given branch, semester, and division" });
    }

    res.json({ success: true, subjects: subjects.flat() });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});








// ✅ 2️⃣ Mark Attendance for a Lecture
router.post("/markattendance/:LectureID", async (req, res) => {
  try {
    const { LectureID } = req.params;
    const { PresentStudents } = req.body; // Array of student IDs

    if (!PresentStudents || !Array.isArray(PresentStudents)) {
      return res.status(400).json({ message: "PresentStudents must be an array" });
    }

    const lecture = await LECTURES.findOne({ LectureID });
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.PresentStudents = PresentStudents;
    await lecture.save();

    res.status(200).json({ message: "Attendance marked successfully", data: lecture });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ 3️⃣ Get Attendance Report for a Lecture
router.get("/getattendance/:LectureID", async (req, res) => {
  try {
    const { LectureID } = req.params;
    const lecture = await LECTURES.findOne({ LectureID });

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const attendancePercentage = ((lecture.PresentStudents.length / lecture.TotalStudents) * 100).toFixed(2);

    res.status(200).json({
      message: "Attendance report fetched",
      LectureID: lecture.LectureID,
      Subject: lecture.Subject,
      TotalStudents: lecture.TotalStudents,
      PresentStudents: lecture.PresentStudents.length,
      AttendancePercentage: `${attendancePercentage}%`
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ 4️⃣ Delete a Lecture (Optional)
router.delete("/deletelecture/:LectureID", async (req, res) => {
  try {
    const { LectureID } = req.params;
    const deletedLecture = await LECTURES.findOneAndDelete({ LectureID });

    if (!deletedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
    