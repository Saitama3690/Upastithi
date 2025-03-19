import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
// import { useTheme } from "next-themes";
// import {Button} from "@/components/ui/button";

function AddStudent() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const IP = import.meta.env.VITE_BACKEND_IP


  // Handle file upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };


  const handleFileUpload = () => {
    if (!file) {
      alert("Please select an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length === 0) {
        alert("No data found in the sheet!");
        return;
      }

      setHeaders(jsonData[0]);
      setTableData(jsonData.slice(1));
    };

    reader.readAsArrayBuffer(file);
  };

  const [rfid, setRfid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startbutton, setstartbutton] = useState(false);

  const fetchRfidData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${IP}getrfid`); // Fetch the RFID data from the backend
      if (response.ok) {
        const data = await response.json();
        console.log(data.Rfid, "the data comes or not");

        // Check directly against the incoming data instead of the outdated state
        if (rfid !== data.Rfid) {
          // Compare incoming RFID data with the current state

          setRfid(data.Rfid); // Update the state with the new RFID

          setTableData((previous) => {
            let copydata = [...previous];
            console.log("data store");

            if (data.Rfid) {
              console.log(data.Rfid, "the data comes or not");

              for (let i = 0; i < copydata.length; i++) {
                if (!copydata[i][5]) {
                  // If column 5 is empty, set RFID
                  copydata[i][5] = data.Rfid;
                  break;
                }
              }
            }

            console.log("stop the store data");

            return copydata;
          });
        }

        setError(""); // Clear any previous errors
      } else {
        throw new Error("No RFID data available");
      }
    } catch (err) {
      console.error("Error fetching RFID:", err);
      setError("Failed to fetch RFID data");
      setRfid(null); // Clear the state if there's an error
    } finally {
      setLoading(false);
    }
  };

  const submitData = async () => {
    try {
      if (tableData) {
          if (tableData[tableData.length-1][5]) {
            const response = await fetch(`${IP}assignData`, {
              method: "POST", // Specify the HTTP method
              headers: {
                "Content-Type": "application/json", // Correct header for sending JSON
              },
              body: JSON.stringify({ data: tableData }), // Stringify the tableData
            });

            if (!response.ok) {
              throw new Error("Failed to submit data");
            }

            const responseData = await response.json();
            console.log("Response:", responseData);
            // Handle successful submission here
          }
        
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error here (e.g., show an error message to the user)
    }
  };

  // Fetch RFID data when the component mounts and continue every 5 seconds
  useEffect(() => {
    let interval = null;
    console.log("file condition:", file);

    if (startbutton && file && headers.length !== 0) {
      console.log("headers", headers);
      console.log("main:", startbutton);
      fetchRfidData(); // Call fetch immediately if `startbutton` is true

      // Poll every 5 seconds
      interval = setInterval(fetchRfidData, 5000);
    }

    // Cleanup the interval when the component unmounts or when `startbutton` changes
    return () => clearInterval(interval);
  }, [startbutton]); // Depend on `startbutton` to start or stop the polling

  return (
    <div className="container h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="container flex-1 flex flex-col">
        <div className="mb-4 p-4 border rounded bg-white shadow-lg text-center flex justify-center items-center">
          <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="mb-4"
          />
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload File
          </button>
        </div>

        <div className="mx-auto overflow-auto">
          <table className="table-auto">
            <thead>
              <tr className="bg-gray-200">
                {headers.map((header, index) => (
                  <th key={index} className="border p-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <button
            onClick={submitData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            submit
          </button>
        </div>
        

        <div>
          <h1>Student data Receiver</h1>











          <button
            onClick={() => {
              !startbutton ? setstartbutton(true) : setstartbutton(false);
            }}
          >
            {!startbutton ? "start fetch" : "stop fetch"}
          </button>













          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {rfid ? (
            <div>
              <h2>Received RFID:</h2>
              <p>{rfid}</p>
            </div>
          ) : (
            <p>No RFID received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default AddStudent;
