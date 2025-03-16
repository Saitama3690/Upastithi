import { useState, useEffect } from "react";
import GlobalApi from "../_service/GlobalApi";

function ClassSelector({
  selectedBranch,
  setSelectedBranch,
  selectedSemester,
  setSelectedSemester,
  selectedDivision,
  setSelectedDivision,
  selectedSubject,
  setSelectedSubject,
}) {
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    GlobalApi.GetAllBranches()
      .then((data) => {
        console.log("📌 Branches Data:", data);
        setBranches(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Error fetching branches:", err);
        setError("Failed to load branches");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBranch) {
      setSemesters([]);
      setDivisions([]);
      setSubjects([]);
      return;
    }

    setLoading(true);
    GlobalApi.GetSemestersByBranch(selectedBranch)
      .then((data) => {
        console.log("📌 Semesters Data:", data);
        setSemesters(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Error fetching semesters:", err);
        setError("Failed to load semesters");
      })
      .finally(() => setLoading(false));
  }, [selectedBranch]);

  useEffect(() => {
    if (!selectedSemester) {
      setDivisions([]);
      setSubjects([]);
      return;
    }

    setLoading(true);
    GlobalApi.GetDivisionsByBranchSemester(selectedBranch, selectedSemester)
      .then((data) => {
        console.log("📌 Divisions Data:", data);
        setDivisions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Error fetching divisions:", err);
        setError("Failed to load divisions");
      })
      .finally(() => setLoading(false));
  }, [selectedSemester]);

  useEffect(() => {
    if (!selectedBranch || !selectedSemester || !selectedDivision) {
      setSubjects([]);
      return;
    }

    setLoading(true);
    setError(null);

    GlobalApi.GetAllSubjectsByBranchSemesterDivision(
      selectedBranch,
      selectedSemester,
      selectedDivision
    )
      .then((data) => {
        console.log("📌 Fetched Subjects:", data);
        if (data && data.success && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        } else {
          console.warn("⚠️ Unexpected response format for subjects:", data);
          setSubjects([]);
        }
      })
      
      .catch((err) => {
        console.error("❌ Error fetching subjects:", err);
        setError("Failed to load subjects");
      })
      .finally(() => setLoading(false));
  }, [selectedBranch, selectedSemester, selectedDivision]);

  return (
    <div className="flex w-full items-center justify-between space-x-4 p-4">
      {/* Branch Selector */}
      <select
        value={selectedBranch}
        onChange={(e) => {
          setSelectedBranch(e.target.value);
          setSelectedSemester("");
          setSelectedDivision("");
          setSelectedSubject("");
        }}
        className="p-2 border rounded w-1/4"
      >
        <option value="">Select Branch</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      {/* Semester Selector */}
      <select
        value={selectedSemester}
        onChange={(e) => {
          setSelectedSemester(e.target.value);
          setSelectedDivision("");
          setSelectedSubject("");
        }}
        className="p-2 border rounded w-1/4"
        disabled={!selectedBranch}
      >
        <option value="">Select Semester</option>
        {semesters.map((semester) => (
          <option key={semester} value={semester}>
            {semester}
          </option>
        ))}
      </select>

      {/* Division Selector */}
      <select
        value={selectedDivision}
        onChange={(e) => {
          setSelectedDivision(e.target.value);
          setSelectedSubject("");
        }}
        className="p-2 border rounded w-1/4"
        disabled={!selectedSemester}
      >
        <option value="">Select Division</option>
        {divisions.map((division) => (
          <option key={division} value={division}>
            {division}
          </option>
        ))}
      </select>

      {/* Subject Selector */}
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="p-2 border rounded w-1/4"
        disabled={!selectedDivision || subjects.length === 0}
      >
        <option value="">Select Subject</option>
        {subjects.map((subject, index) => (
          <option key={index} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      {/* Display error message if API fails */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default ClassSelector;
