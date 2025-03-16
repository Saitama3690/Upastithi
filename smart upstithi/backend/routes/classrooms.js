const express = require("express");
const router = express.Router();
const CLASSES = require("../models/Classrooms");

// ✅ Add a new classroom
router.post("/add-classroom", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); // ✅ Check incoming data

    const { Branch, Semester, Division } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Invalid JSON format or empty request body" });
    }

    if (!Branch || !Semester || !Division) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if values match expected format
    console.log("Branch:", Branch, "Semester:", Semester, "Division:", Division);

    if (!/^[1-8]$/.test(Semester.toString())) {
      return res.status(400).json({ message: "Semester must be a number between 1 and 8" });
    }

    if (!/^[A-H1-7]$/.test(Division.toString())) {
      return res.status(400).json({ message: "Division must be between A-H or 1-7" });
    }

    // ✅ Debug MongoDB query
    const existingClassroom = await CLASSES.findOne({ Branch, Semester, Division });
    console.log("Existing Classroom:", existingClassroom);

    if (existingClassroom) {
      return res.status(409).json({ message: "Classroom already exists" });
    }

    // ✅ Debug Classroom Insertion
    const newClassroom = new CLASSES({ Branch, Semester, Division });
    await newClassroom.save();
    console.log("Classroom added to DB:", newClassroom);

    res.status(201).json({ message: "Classroom added successfully", data: newClassroom });
  } catch (error) {
    console.error("Error adding classroom:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});



// ✅ Delete a classroom
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClassroom = await CLASSES.findOneAndDelete({ ClassroomID: id });

    if (!deletedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    console.error("Error deleting classroom:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all branches




//returns classroomID 

router.post("/get-classroomID", async (req, res) => {
  try {
    // Use req.body instead of req.params
    const { branch, semester, division } = req.body;

    console.log(`Backend received data: Branch: ${branch}, Semester: ${semester}, Division: ${division}`);

    // Fetch classroom based on the given criteria
    const classroom = await CLASSES.findOne({ Branch: branch, Semester: semester, Division: division });

    // If no classroom is found, return a 404 response
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Return the found classroom data
    return res.status(200).json({ classroomID: classroom._id, classroom });

  } catch (error) {
    console.error("Error retrieving classroom:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




router.get("/get-classrooms", async (req, res) => {
  try {
    const classrooms = await CLASSES.find();
    
    console.log("niggah niggah" , classrooms);
    // Map the classrooms to the required format
    const formattedClassrooms = classrooms.map((classroom) => ({
      Branch: classroom.Branch,
      Semester:classroom.Semester, // Append "sem"
      Division: classroom.Division // Append "Division"
    }));
    
    console.log("niggah" , formattedClassrooms);
    res.status(200).json(formattedClassrooms);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





// ✅ Get a specific classroom by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await CLASSES.findOne({ ClassroomID: id }).select("-__v");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json(classroom);
  } catch (error) {
    console.error("Error fetching classroom:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all unique branches
router.get("/branches", async (req, res) => {
  try {
    const branches = await CLASSES.distinct("Branch");
    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get all unique divisions
router.get("/divisions", async (req, res) => {
  try {
    const divisions = await CLASSES.distinct("Division");
    res.json(divisions);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
