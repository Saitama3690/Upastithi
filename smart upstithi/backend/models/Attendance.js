const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    Enrollment: { type: Number, required: true },
    Name: { type: String, required: true },
    Subject: { type: String, required: true },
    Branch: { type: String, required: true },
    Semester: { type: String, required: true },
    Division: { type: String, required: true },
    Attendance: [
        {
            Date: { type: String, required: true }, // Format: "YYYY-MM-DD"
            Present: { type: Boolean, required: true }
        }
    ],
    Month:{ type:String, required: true}
});

// Ensure the model is registered correctly
const Attendance = mongoose.model("Attendance", attendanceSchema, "Attendance");

module.exports = Attendance;
