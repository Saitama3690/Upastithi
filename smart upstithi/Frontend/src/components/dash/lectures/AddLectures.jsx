import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const branches = ["Computer Science", "Electronics", "Mechanical", "Civil"];
const subjectsList = ["Mathematics", "Physics", "Chemistry", "Programming", "Database"];

const AddLectures = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [division, setDivision] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddSubject = () => {
    setSelectedSubjects((prev) => [...prev, { name: "" }]);
  };

  const handleSubjectChange = (index, value) => {
    setSelectedSubjects((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("User not logged in.");
      setLoading(false);
      return;
    }

    let facultyID;
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      facultyID = decodedToken?.user?.id;
      if (!facultyID) {
        setMessage("Faculty ID not found in token.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setMessage("Invalid token. Please log in again.");
      setLoading(false);
      return;
    }

    const finalData = {
      FacultyID: facultyID,
      Branch: selectedBranch,
      Semester: semester,
      Division: division,
      Subjects: selectedSubjects.map((sub) => sub.name),
    };

    console.log("Final Data to Submit:", finalData);

    try {
      const response = await fetch("https://192.168.1.4:3000/api/lectures/addlecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      const json = await response.json();
      console.log("Server Response:", json);

      if (json.success) {
        alert("Lecture added successfully!");
        navigate("/dashboard");
      } else {
        setMessage("Error: " + (json.errors?.join(", ") || json.message));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Failed to submit data. Please check your connection.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Lectures</h2>

      {/* Select Branch Dropdown */}
      <label className="block mb-2">Select Branch:</label>
      <select
        className="border rounded-lg px-3 py-2 w-full mb-4"
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="">-- Select Branch --</option>
        {branches.map((branch, index) => (
          <option key={index} value={branch}>{branch}</option>
        ))}
      </select>

      {/* Semester Input */}
      <label className="block mb-2">Enter Semester:</label>
      <Input
        type="number"
        className="border rounded-lg px-3 py-2 w-full mb-4"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        placeholder="Enter Semester"
      />

      {/* Division Input */}
      <label className="block mb-2">Enter Division:</label>
      <Input
        type="text"
        className="border rounded-lg px-3 py-2 w-full mb-4"
        value={division}
        onChange={(e) => setDivision(e.target.value)}
        placeholder="Enter Division"
      />

      

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

export default AddLectures;
