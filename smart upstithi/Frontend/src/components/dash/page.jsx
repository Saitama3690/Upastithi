"use client";
import { react, useEffect, useState } from "react";
import ClassSelector from "../../../app/_components/ClassSelecter";
import moment from "moment";
import MonthSelector from "../../../app/_components/MonthSelector";
import GlobalApi from "../../../app/_service/GlobalApi";
import { toast } from "react-toastify";
import StatusList from "./_components/StatusList";


function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("MMMM YYYY")
  ); // Initialize with current month
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState(null);

//   const formattedMonth = moment(selectedMonth, "MMMM YYYY").format("MM-YYYY"); // Fix format

  
useEffect(() => {
    if (!selectedBranch || !selectedSemester || !selectedDivision || !selectedMonth || !selectedSubject) {
      return; // Don't make API call if any required field is missing
    }
  
    setIsLoading(true);
  
    const formattedMonth = moment(selectedMonth, "MMMM YYYY").format("MM-YYYY");
  
    console.log("📌 Fetching attendance for:", {
      branch: selectedBranch,
      semester: selectedSemester,
      division: selectedDivision,
      month: formattedMonth,
      subject: selectedSubject,
    });
  
    GlobalApi.GetAttendanceList(
      selectedBranch,
      selectedSemester,
      selectedDivision,
      formattedMonth,
      selectedSubject
    )
      .then((response) => {
        setAttendanceList(response);
        console.log("✅ Attendance fetched:", response);
        toast.success("Attendance data loaded");
      })
      .catch((error) => {
        console.error("❌ Error fetching attendance:", error);
        toast.error("Failed to load attendance data");
        setAttendanceList(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  
  }, [selectedMonth,selectedBranch, selectedSemester, selectedDivision,  selectedSubject]);

  return (
    <div className="p-4">
      <p className="font-bold text-2xl">Dashboard</p>
      <div className="flex items-center justify-between">
        <MonthSelector
          setMonth={setSelectedMonth}
          selectedMonth={selectedMonth}
        />

        <ClassSelector
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          setSelectedSubject={setSelectedSubject}
        />
      </div>

      <div>
        <StatusList attendanceList={attendanceList}/>
      </div>
    </div>
  );
}

export default Dashboard;
