

const express = require("express");
const router = express.Router();
const RFIDStudent = require("../models/Students"); 

// Add Student
router.post("/addstudent", async (req, res) => {
  try {
    console.log("Received Student Data:", req.body);
    res.status(200).json({ success: true, message: "Student added successfully!" });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get Latest RFID Data
router.get("/getrfid", async (req, res) => {
  if (rfidData) {
    console.log(rfidData, "in the getrfid");
    await res.json({ Rfid: rfidData });
    rfidData = null;
  } else {
    res.status(404).json({ message: "No RFID data available" });
  }
});

//get name by id

router.get("/getStudentNameByID/:id", async (req, res) => {
  try {
    const student = await RFIDStudent.findOne({ Id: parseInt(req.params._id) });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, name: student.name });
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post("/getEnrollment", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    console.log(`${name} backend`, name)
    
    const student = await RFIDStudent.findOne({ Name: name });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    
    res.json({ success: true, enrollment: student.Enrollment });
  } catch (error) {
    console.error("❌ Error fetching enrollment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// Assign Data and Save in Database
router.post("/assignData", async (req, res) => {
  let data = req.body.data;
  console.log("Received data:", data);

  try {
    const studentsToInsert = data.map((studentData) => {
      return new RFIDStudent({
        Enrollment: studentData[0],
        Name: studentData[1],
        Branch: studentData[2],
        Semester: studentData[3],
        Phone: studentData[4],
        Rfid: studentData[5],
      });
    });

    await RFIDStudent.insertMany(studentsToInsert);

    console.log(`Data saved successfully`);
    res.status(200).json({
      message: "Data received and saved successfully",
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({
      message: "Error saving data",
      error: error.message,
    });
  }
});

module.exports = router;
