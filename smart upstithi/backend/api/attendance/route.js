import { server } from "../../server";
import Attendance from "../../utils/models/Attendance";
import Students from "../../utils/models/Students";
import Lectures from "../../utils/models/Lectures";
import Faculty from "../../utils/models/Faculty";
import { NextResponse } from "next/server";
import { eq, and, like } from "drizzle-orm"; // Ensure correct query handling

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const ClassroomID = searchParams.get("ClassroomID");
        const month = searchParams.get("month");

        if (!ClassroomID || !month) {
            return NextResponse.json({ success: false, message: "Missing ClassroomID or month" }, { status: 400 });
        }

        // 🔹 Fetch lectures along with faculty names
        const lectures = await server
            .select({
                LectureID: Lectures.LectureID,
                Subject: Lectures.Subject,
                Date: Lectures.Date,
                FacultyID: Lectures.FacultyID,
                FacultyName: Faculty.Name,
            })
            .from(Lectures)
            .leftJoin(Faculty, eq(Lectures.FacultyID, Faculty.FacultyID))
            .where(and(eq(Lectures.ClassroomID, ClassroomID), like(Lectures.Date, `${month}%`)));

        if (!lectures.length) {
            return NextResponse.json({ success: false, message: "No lectures found for this month." }, { status: 404 });
        }

        // 🔹 Fetch attendance data & ensure all students are included
        const result = await server
            .select({
                name: Students.Name,
                present: Attendance.Present,
                day: Attendance.Day,
                date: Attendance.Date,
                subject: Lectures.Subject,
                FacultyName: Faculty.Name,
                studentId: Students.Enrollment,
            })
            .from(Students)
            .leftJoin(Attendance, eq(Students.Id, Attendance.Id)) // Join to include all students
            .leftJoin(Lectures, eq(Attendance.LectureID, Lectures.LectureID))
            .leftJoin(Faculty, eq(Lectures.FacultyID, Faculty.FacultyID))
            .where(and(eq(Students.ClassroomID, ClassroomID), like(Attendance.Date, `${month}%`)));

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
    }
}
