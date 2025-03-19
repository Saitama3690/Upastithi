const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  FacultyID: { type: mongoose.Schema.Types.ObjectId, ref: "faculty", required: true }, // Foreign Key Reference
    
  Division: { type: String, required: true }, // Division (e.g., "A", "B")
  Semester: { type: Number, required: true }, // Semester (e.g., 1, 2, 3, ...)
  Branch: { type: String, required: true }, // Department Name

  TypeOfLecture : {type : String, required: true},
  
  Subjects: { type: String, required: true } // Array of subjects
});

const Lecture = mongoose.model("Lecture", LectureSchema);

module.exports = Lecture;