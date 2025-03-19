"use client";
import { useState, useEffect } from "react";
import MonthSelector from "../../../../app/_components/MonthSelector";
import { Button } from "@/components/ui/button";
import GlobalApi from "../../../../app/_service/GlobalApi";
import moment from "moment";
import { toast } from "react-toastify";
import AttendanceGrid from "./_components/AttendanceGrid";
import ClassSelector from "../../../../app/_components/ClassSelecter";

function Attendance() {
  // State fixes
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("MMMM YYYY")
  ); // Initialize with current month
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [typeOfLecture, setTypeOfLecture] = useState("");

  const [attendanceList, setAttendanceList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSearchHandler = () => {
    if (
      !selectedBranch ||
      !selectedSemester ||
      !selectedDivision ||
      !selectedMonth
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    // Ensure correct format MM-YYYY before sending API request
    const formattedMonth = moment(selectedMonth, "MMMM YYYY").format("MM-YYYY"); // Fix format
    console.log("mahina ye he", formattedMonth)

    console.log("📌 Sending API request with:", {
      branch: selectedBranch,
      semester: selectedSemester,
      division: selectedDivision,
      month: formattedMonth,
      subject: selectedSubject,
      typeOfLecture: typeOfLecture
    });

    // if(!selectedBranch && !selectedSemester && !selectedDivision && !formattedMonth){

    GlobalApi.GetAttendanceList(
      selectedBranch,
      selectedSemester,
      selectedDivision,
      formattedMonth,
      selectedSubject,
      typeOfLecture
    )
      .then((response) => {
        setAttendanceList(response);
          console.log("hora ro mat" ,response )
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
    // }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3">Attendance Management</h2>

      <div className="flex flex-1 p-4 items-center border rounded-lg shadow-sm">
        {/* Fixed MonthSelector to update selectedMonth */}
        <FilterSection label="Select a Month:">
          <MonthSelector
            setMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
          />
        </FilterSection>

        <ClassSelector
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedDivision={selectedDivision}
          setSelectedDivision={setSelectedDivision}
          setSelectedSubject={setSelectedSubject}
          typeOfLecture={typeOfLecture}
          setTypeOfLecture={setTypeOfLecture}
        />

        <div className="lg:col-span-4">
          <Button
            onClick={onSearchHandler}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
      {attendanceList ? (
        <AttendanceGrid
          attendanceList={attendanceList}
          selectedMonth={selectedMonth}
        />
      ) : null}
    </div>
  );
}

const FilterSection = ({ label, children }) => (
  <div className="w-half">
    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="w-full">{children}</div>
  </div>
);

export default Attendance;

{
  /*
        <FilterSection label="Select a Branch:">
        <BranchSelector onBranchChange={(branch) => {
                console.log("Branch Selected:", branch);
                setSelectedBranch(branch);
            }} />        </FilterSection>

        <FilterSection label="Select a Semester:">
        <SemesterSelector selectedBranch={selectedBranch} onSemesterChange={(semester) => {
                console.log("Semester Selected:", semester);
                setSelectedSemester(semester);
            }} />       
        </FilterSection>

        <FilterSection label="Select a Division:">
        <DivisionSelector selectedSemester={selectedSemester} onDivisionChange={(division) => {
                console.log("Division Selected:", division);
                setSelectedDivision(division);
            }} />
        </FilterSection>
        
        <FilterSection label="Select a Subject:">
        <SubjectSelector selectedDivision={selectedDivision} />

        </FilterSection>
*/
}
