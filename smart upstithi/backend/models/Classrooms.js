const mongoose = require("mongoose");
const { Schema } = mongoose;

const classroomSchema = new Schema({
  Branch: { type: String, required: true },
  Semester: { type: String, required: true },
  Division: { 
    type: String, 
    required: true,
    validate: {
      validator: function (value) {
        return /^[A-H1-7]$/.test(value); // Allows 'A' to 'H' or '1' to '7'
      },
      message: "Division must be in range A to H, or 1 to 7"
    }
  }
});

// Ensure consistency in model name
const Classroom = mongoose.model("Classroom", classroomSchema, "classrooms");
module.exports = Classroom;
  
  // ClassroomID: { type: String, required: true, unique: true },