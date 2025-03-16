import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";

import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { provideGlobalGridOptions } from "ag-grid-community";
provideGlobalGridOptions({ theme: "legacy" });

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function AttendanceGrid({ attendanceList, selectedMonth }) {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    // { field: "Id", headerName: "Serial No." },
    { field: "Enrollment", headerName: "Enrollment No." },
    { field: "Name", headerName: "Student Name" },
  ]);

  useEffect(() => {
    if (!attendanceList || !attendanceList.attendance) {
      console.warn("Attendance data is missing or empty.");
      return;
    }

    console.log("Received Attendance Data:", attendanceList);

    const daysInMonth = moment(selectedMonth, "YYYY-MM").daysInMonth();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Function to check if a student was present on a given day
    const isPresent = (Id, day) => {
      const student = attendanceList.attendance.find((item) => item.Id === Id);
      if (!student || !student.Attendance) return false;
      return student.Attendance.some(
        (entry) => moment(entry.Date, "YYYY-MM-DD").date() === day && entry.Present
      );
    };

    // Set column headers dynamically with checkbox renderer
    setColDefs([
      { field: "Id", headerName: "Serial No." },
      { field: "Enrollment", headerName: "Enrollment No." },
      { field: "Name", headerName: "Student Name" },
      ...daysArray.map((date) => ({
        field: date.toString(),
        headerName: `${date}`,
        width: 100,
        editable: true,
        cellRendererFramework: (params) => (
          <input
            type="checkbox"
            checked={isPresent(params.data.Id, date)}
            onChange={(e) => {
              const updatedData = [...rowData];
              const rowIndex = updatedData.findIndex((row) => row.Id === params.data.Id);
              if (rowIndex !== -1) {
                updatedData[rowIndex][date] = e.target.checked;
                setRowData(updatedData);
              }
            }}
          />
        ),
      })),
    ]);

    // Transform attendance data
    const transformedData = attendanceList.attendance.map((student,index) => {
      const studentData = {
        Id: index+1,
        Enrollment: student.Enrollment,
        Name: student.Name || "N/A",
      };

      daysArray.forEach((day) => {
        studentData[day] = isPresent(student.Id, day);
      });

      return studentData;
    });

    setRowData(transformedData);
  }, [attendanceList]);

  return (
    <div className="ag-theme-alpine custom-grid" style={{ height: 500, width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} pagination={true} />
    </div>
  );
}

export default AttendanceGrid;
