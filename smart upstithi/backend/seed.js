require("dotenv").config();  // Load environment variables

const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("❌ MONGO_URI is missing in .env file");
    process.exit(1);  // Exit script if no URI is found
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

const dummyAttendance = [
    { Id: 1, Enrollment: 101, ClassroomID: 201, LectureID: 301, Present: true, Day: 1, Date: "2024-02-20" },
    { Id: 2, Enrollment: 102, ClassroomID: 201, LectureID: 301, Present: false, Day: 1, Date: "2024-02-20" },
];

const seedDatabase = async () => {
    try {
        await Attendance.deleteMany({});
        await Attendance.insertMany(dummyAttendance);
        console.log("✅ Dummy attendance data inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error inserting dummy data:", error);
        mongoose.connection.close();
    }
};

seedDatabase();
