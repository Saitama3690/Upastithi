import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const departments = ["Computer Science", "Electrical", "Mechanical", "Civil"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const subjectsList = ["Mathematics", "Physics", "Chemistry", "Programming", "Database"];

const LecturesSelect = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([
    { name: "", days: new Map(), timings: new Map() }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddSubject = () => {
    setSelectedSubjects((prev) => [...prev, { name: "", days: new Map(), timings: new Map() }]);
  };

  const handleSubjectChange = (index, value) => {
    setSelectedSubjects((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleDayToggle = (subjectIndex, day) => {
    setSelectedSubjects((prev) => {
      const updated = [...prev];
      const subject = updated[subjectIndex];

      if (subject.days.has(day)) {
        subject.days.delete(day);
        subject.timings.delete(day);
      } else {
        subject.days.set(day, true);
        subject.timings.set(day, { start: "", end: "" });
      }

      return [...updated];
    });
  };

  const handleTimeChange = (subjectIndex, day, timeType, value) => {
    setSelectedSubjects((prev) => {
      const updated = [...prev];
      if (updated[subjectIndex].timings.has(day)) {
        updated[subjectIndex].timings.set(day, {
          ...updated[subjectIndex].timings.get(day),
          [timeType]: value,
        });
      }
      return [...updated];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const savedData = JSON.parse(sessionStorage.getItem("signupData"));

    if (!savedData) {
      setMessage("Signup data not found. Please sign up again.");
      setLoading(false);
      return;
    }

    const formattedSubjects = selectedSubjects.map((sub) => ({
      name: sub.name,
      days: Array.from(sub.days.keys()),
      timings: Object.fromEntries(sub.timings),
    }));

    const finalData = {
      FacultyID: savedData._id, // Now we have the correct faculty ID!
      department,
      subjects: selectedSubjects.map(sub => ({
        name: sub.name,
        days: Array.from(sub.days.keys()),
        timings: Object.fromEntries(sub.timings),
      })),
    };

    try {
      const response = await fetch("https://192.168.1.4:3000/api/lectures/addlecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const json = await response.json();
      console.log("Server Response:", json);

      if (json.success) {
        alert("Lecture added successfully!");
        sessionStorage.removeItem("signupData");
        navigate("/dashboard");
      } else {
        setMessage("Error: " + (json.errors?.join(", ") || json.message));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Failed to submit data. Please check your connection.");
    }

    console.log("Final Data:", JSON.stringify(finalData, null, 2));

    navigate("/dashboard");

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Faculty Signup</h2>

      {/* Department Selection */}
      <label className="block mb-2">Select Department:</label>
      <select
        className="border rounded-lg px-3 py-2 w-full mb-4"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">-- Select Department --</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      {/* Subjects Section */}
      <h3 className="text-lg font-semibold mb-2">Add Subjects</h3>
      {selectedSubjects.map((subject, index) => (
        <div key={index} className="border p-4 rounded-lg mb-4">
          <label className="block mb-2">Select Subject:</label>
          <select
            className="border rounded-lg px-3 py-2 w-full mb-2"
            value={subject.name}
            onChange={(e) => handleSubjectChange(index, e.target.value)}
          >
            <option value="">-- Select Subject --</option>
            {subjectsList.map((subjectName) => (
              <option key={subjectName} value={subjectName}>{subjectName}</option>
            ))}
          </select>

          {/* Day and Time Selection */}
          <div className="mt-3">
            <h4 className="font-semibold mb-2">Select Days & Timings</h4>
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-4 mb-2">
                <Checkbox
                  checked={subject.days.has(day)}
                  onChange={() => handleDayToggle(index, day)}
                />
                <span>{day}</span>
                {subject.days.has(day) && (
                  <>
                    <Input
                      type="time"
                      className="border rounded-lg px-2 py-1"
                      value={subject.timings.get(day)?.start || ""}
                      onChange={(e) => handleTimeChange(index, day, "start", e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      className="border rounded-lg px-2 py-1"
                      value={subject.timings.get(day)?.end || ""}
                      onChange={(e) => handleTimeChange(index, day, "end", e.target.value)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={handleAddSubject} className="mt-2">+ Add Subject</Button>
      <Button onClick={handleSubmit} className="mt-4 w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default LecturesSelect;
