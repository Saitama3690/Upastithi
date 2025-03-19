const mongoose = require("mongoose");

const { Schema } = mongoose;

const RfidStudent = new Schema({
  Id: { type: Number, required: true },
  Enrollment: { type: Number, required: true },
  Name: { type: String, required: true },
  Branch: { type: String, required: true },
  Semester: { type: String, required: true },
  ClassroomID: {type:Number, required: true},
  Phone: { type: Number, required: true },
});

module.exports = mongoose.model("RFIDStudent", RfidStudent, "RFIDStudent");
