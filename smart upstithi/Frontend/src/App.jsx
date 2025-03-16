import { Route, Routes, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Layout from "./components/dash/layout";
import Dashboard from "./components/dash/page";
import AddStudent from "./components/sidebar/AddStudent";
import Attendance from "./components/dash/attendance/page";
import Statistics from "./components/sidebar/statistics";
import LecturesSelect from "./components/auth/factulty info/LecturesSelect"
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddClassroom from "./components/dash/Classroom/AddClassroom";
import AddLectures from "./components/dash/lectures/AddLectures";
import DetectionComponent from "./components/faceDetection/DetectionComponent";
import {React,useState, useEffect} from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

import AddAttendance from "./components/dash/attendance/AddAttendance";

function App() {

  const [faces, setFaces] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        axios.get("http://127.0.0.1:5000/detect")
          .then((response) => {
            setFaces(response.data.faces);
          })
          .catch((error) => console.error(error));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  
  return (
    <KindeProvider
      clientId="your-client-id"
      domain="your-kinde-domain"
      redirectUri={window.location.origin}
      logoutUri={window.location.origin}
      >
      <BrowserRouter>
      <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/index.html" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signup/fill-info" element={<LecturesSelect />} />

    {/* Protected Routes (Dashboard with Layout) */}
    <Route path="/dashboard/*" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="addStudent" element={<AddStudent />} />
      <Route path="show-attendance" element={<Attendance />} />
      <Route path="statistics" element={<Statistics />} />
      {/* <Route path="statistics" element={<WebcamCapture />} /> */}

      {/* <Route path="update-student" element={<ModifyStudent />} /> */}
      <Route path="add-attendance" element={<AddAttendance />} />
      
      <Route path="face-detection" element={<DetectionComponent />} />
      <Route path="add-lecture" element={<AddLectures />} />
    </Route>
  </Routes>
  </BrowserRouter>
  </KindeProvider>

  );
}

export default App;
