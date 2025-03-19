import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../../../../app/_service/GlobalApi";

const BackendUrl = import.meta.env.VITE_BACKEND_IP;

const TYPEOFLECTURE = ["Lecture", "Lab"];


const AddAttendance = () => {
  const [names, setNames] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [typeOfLecture, setTypeOfLecture] = useState("");
  const [message, setMessage] = useState("");
  // const [dataname,setdataname] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    //face detection
    
    const [status, setStatus] = useState("");
    const [processedImage, setProcessedImage] = useState("");
    const [capturedImages, setCapturedImages] = useState([]);
    
    const [dataname, setDataname] = useState([]);
    const [capturing, setCapturing] = useState(false);
    const imgRef = useRef(null);
    let captureInterval = useRef(null);
    const captureAndSendImage = async () => {
      setStatus("Capturing image...");
    const tempImage = new Image();
    tempImage.crossOrigin = "anonymous";
    tempImage.src = imgRef.current.src;
    
    tempImage.onload = async () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 640;
      canvas.height = 480;
      context.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
      
      try {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const imageData = reader.result.split(",")[1];
            setStatus("Sending image...");
            const response = await fetch(
              "http://127.0.0.1:5001/process-frame",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData }),
              }
            );
            
            setCapturedImages((prev) => {
              const newImages = [...prev, tempImage.src];
              if (newImages.length >= 10) stopCapturing();
              return newImages;
            });

            const result = await response.json();
            setDataname((prev) => [...prev, result.detected_objects || []]);
            
            if (result.error) {
              setStatus("Error: " + result.error);
            } else {
              setStatus("Detection completed!");
              setProcessedImage("http://127.0.0.1:5001/uploads/detected.jpg");
            }
          };
        }, "image/jpeg");
      } catch (error) {
        console.error("Error:", error);
        setStatus("Failed to send image!");
      }
    };
    
    tempImage.onerror = () => {
      console.error("Failed to load image from ESP32-CAM!");
      setStatus("Error loading ESP32-CAM image!");
    };
  };

  const startCapturing = () => {
    if (!capturing) {
      setDataname([]); // Reset detected names on a new session
      setCapturing(true);
      captureInterval.current = setInterval(captureAndSendImage, 5000);
    }
  };
  
  const stopCapturing = () => {
    setCapturing(false);
    clearInterval(captureInterval.current);
  };
  
  
  
  
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    
    const detectedNames = ["Akshil Rajput", "Parth Pathak", "Pratham Pandya", "Parth Mishra"];
    
    try {
      const attendancePromises = detectedNames.map(async (name) => {
        try {
          const enrollmentResponse = await fetch(`${BackendUrl}api/students/getEnrollment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
          });

          const enrollmentData = await enrollmentResponse.json();
          if (!enrollmentResponse.ok || !enrollmentData.success) {
            console.error(`Failed to fetch enrollment for ${name}:`, enrollmentData.message);
            return null;
          }

          console.log(`${name} ka enrollment:`, enrollmentData.enrollment);

          const attendanceData = {
            Enrollment: enrollmentData.enrollment,
            Name: name,
            Subject: selectedSubject,
            TypeOfLecture: typeOfLecture, 
            Branch: selectedBranch,
            Semester: selectedSemester,
            Division: selectedDivision,
            Attendance: [{ Date: new Date().toISOString().split('T')[0], Present: true }],
            Month: `${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}`
          };

          console.log("this is going as attendance", attendanceData);

          const response = await fetch(`${BackendUrl}api/attendance/add-attendance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(attendanceData),
          });

          const result = await response.json();
          if (!response.ok) {
            console.error(`Failed to submit attendance for ${name}:`, result.message);
            return null;
          }

          return `Attendance for ${name} submitted successfully`;
        } catch (error) {
          console.error(`Error processing attendance for ${name}:`, error);
          return null;
        }
      });

      // Wait for all attendance submissions to complete
      const results = await Promise.all(attendancePromises);
      const successfulSubmissions = results.filter((res) => res !== null);

      if (successfulSubmissions.length > 0) {
        setMessage(`${successfulSubmissions.length} students' attendance submitted successfully`);
      } else {
        setMessage("Failed to submit attendance for all students");
      }
    } catch (error) {
      console.error("Error processing multiple attendances:", error);
      setMessage("An error occurred while submitting attendance");
    } finally {
      setLoading(false);
    }
};


  
  
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Attendance</h2>

      {/* Branch Selector */}
      <select
        value={selectedBranch}
        onChange={(e) => {
          setSelectedBranch(e.target.value);
          setSelectedSemester("");
          setSelectedDivision("");
          setSelectedSubject("");
        }}
        className="border rounded-lg px-3 py-2 w-full mb-4"
        >
        <option value="">Select Branch</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      {/* Semester Selector */}
      <h3 className="text-lg font-semibold mb-2">Select Semester</h3>

      <select
        value={selectedSemester}
        onChange={(e) => {
          setSelectedSemester(e.target.value);
          setSelectedDivision("");
          setSelectedSubject("");
        }}
        className="border rounded-lg px-3 py-2 w-full mb-4"
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
      <h3 className="text-lg font-semibold mb-2">Select Division</h3>

      <select
        value={selectedDivision}
        onChange={(e) => {
          setSelectedDivision(e.target.value);
          setSelectedSubject("");
        }}
        className="border rounded-lg px-3 py-2 w-full mb-4"
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
      <h3 className="text-lg font-semibold mb-2">Select Subject</h3>

      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full mb-4"
        disabled={!selectedDivision || subjects.length === 0}
        >
        <option value="">Select Subject</option>
        {subjects.map((subject, index) => (
          <option key={index} value={subject}>
            {subject}
          </option>
        ))}
      </select>

        {/* type of lecture */}

        <h3 className="text-lg font-semibold mb-2">What Type Of Period it is</h3>

      <select
       value={typeOfLecture}
       onChange={(e) => setTypeOfLecture(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full mb-4"
        disabled={!selectedDivision || subjects.length === 0}
        >
        <option value="">Select Type of period</option>
        {TYPEOFLECTURE.map((Type, index) => (
          <option key={index} value={Type}>
            {Type}
          </option>
        ))}
      </select>





      {/* Display error message if API fails */}
      <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h2>ESP32-CAM Face Detection</h2>

        {/* ESP32 Camera Stream */}
        <img
          id="espCamStream"
          ref={imgRef}
          crossOrigin="anonymous"
          width="640"
          height="480"
          src="http://192.168.201.83:81/stream"
          alt="ESP32-CAM Stream"
          style={{ border: "2px solid black", margin: "10px" }}
          />

        <br />
        <Button onClick={startCapturing} disabled={capturing}>
          Start Capturing
        </Button>
        <Button onClick={stopCapturing} disabled={!capturing} className="ml-2">
          Stop Capturing
        </Button>
        <p>{status}</p>

        <h2>Captured Images</h2>
        {capturedImages.map((img, index) => (
          <div key={index}>
            <img
              width="320"
              height="240"
              src={img}
              alt={`Captured ${index + 1}`}
              style={{ border: "1px solid black", margin: "5px" }}
            />
            <p>
              Detected Students:{" "}
              {dataname[index]?.join(", ") || "No one detected"}
            </p>
          </div>
        ))}

        <ul>
          {dataname.flat().map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
      {message && <p className="mt-4 text-red-500">{message}</p>}


      <Button onClick={handleSubmit}>Add Attendance</Button>
      </div>
  );
};
export default AddAttendance;
