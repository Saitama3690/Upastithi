const express = require("express");
const router = express.Router();
const Attendances = require("../models/Attendance");
const Classroom = require("../models/Classrooms");
const moment = require("moment");


let recognitionState = "Recognising"; // Default status


router.post("/update-recognition", (req, res) => {
  const { status } = req.body;

  if (!status) {
      return res.status(400).json({ error: "Recognition status is required." });
  }

  recognitionState = status; // Update global status
  console.log(`📢 Recognition updated: ${status}`);
  res.json({ message: "Recognition status updated successfully." });
});

// ✅ API to send the recognition status to ESP32
router.get("/recognition-status", (req, res) => {
  res.json({ status: recognitionState });
});


// ✅ Fetch Attendance Records
router.post("/show-attendance", async (req, res) => {
  try {
    const { branch, semester, division, month, subject, type} = req.body;

    // if (!classroomID || !month) {
    //   return res
    //     .status(400)
    //     .json({ error: "ClassroomID and month are required." });
    // }

    //   // Compute date range for filtering
    const startDate = moment(month, "MM-YYYY")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(month, "MM-YYYY")
      .endOf("month")
      .format("YYYY-MM-DD");

      console

    // Find attendance records for the given classroom and month
    const attendanceRecords = await Attendances.find({
      Branch: branch,
      Semester: String(semester),
      Division: String(division),
      Month: month,
      Subject: subject,
      TypeOfLecture: type,

      // More efficient than regex //date hatake month update karna he
    });
    console.log("ese dikhta hai attendance",attendanceRecords,branch, semester, division, month,subject, type);

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.json({ attendance: attendanceRecords });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ Record Attendance (POST)
router.post("/", async (req, res) => {
  try {
    const { Enrollment, ClassroomID, LectureID, Present, Date } = req.body;

    if (!Enrollment || !ClassroomID || !LectureID || !Date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAttendance = new Attendance({
      Enrollment,
      ClassroomID,
      LectureID,
      Present,
      Date,
    });

    await newAttendance.save();
    res
      .status(201)
      .json({ message: "Attendance recorded successfully", newAttendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-attendance", async (req, res) => {
  try {
    const {
      Enrollment,
      Name,
      Subject,
      TypeOfLecture,
      Branch,
      Semester,
      Division,
      Attendance: newAttendance,
      Month
    } = req.body;

    console.log("fetch hui hui api me esa aa raha hai ", req.body)

    // ✅ FIXED: Removed !Date from validation
    if (!Enrollment || !Name || !Subject ||  !newAttendance) {
      return res
        .status(400)
        .json({ error: "All fields including Attendance array are required" });
    }

    // Find existing record by Id, LectureID, and ClassroomID
    let existingRecord = await Attendances.findOne({
      Enrollment,
      Subject,
      TypeOfLecture,
      Semester,
      Division,
      Month
    });

    if (existingRecord) {
      // Append new attendance records while preventing duplicates
      const existingDates = new Set(
        existingRecord.Attendance.map((a) => a.Date)
      );

      newAttendance.forEach((entry) => {
        if (!existingDates.has(entry.Date)) {
          existingRecord.Attendance.push(entry);
        }
      });

      await existingRecord.save();
      return res.status(200).json({
        message: "Attendance updated successfully",
        data: existingRecord,
      });
    } else {
      // ✅ FIXED: Creating new record properly
      const newRecord = new Attendances({
        Enrollment,
        Name,
        Subject,
        Branch,
        TypeOfLecture,
        Semester,
        Division,
        Attendance: newAttendance, // Array of { Date, Present }
        Month
      });

      await newRecord.save();
      return res.status(201).json({
        message: "New attendance record created successfully",
        data: newRecord,
      });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
