import axios from "axios";
import moment from "moment";

const BASE_URL = "https://192.168.1.4:3000/api";

const GlobalApi = {
  // ✅ Fetch all classrooms
  GetAllClassrooms: async () => {
    try {
      // const response = await axios.get(`${BASE_URL}/classroom/classrooms`);
      const params = new URLSearchParams({
        branch: "Computer Science",
        semester: 3,
        division: "A",
      }).toString();

      const response = await axios.get(
        `${BASE_URL}/api/lectures/get-classroom?${params}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ API Error (Classrooms):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },

  // ✅ Fetch all branches
  GetAllBranches: async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      let facultyID = decodedToken?.user?.id;
      console.log("teacher hai",facultyID)
      const response = await axios.get(`${BASE_URL}/lectures/branches`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming token-based authentication
        },
        params: {facultyID: facultyID},
      
      });
      console.log("authority",response);
      return response.data;
    } catch (error) {
      console.error(
        "❌ API Error (Branches):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },
  

  // ✅ Fetch semesters by branch
  GetSemestersByBranch: async (branch) => {
    try {
      const response = await axios.get(`${BASE_URL}/lectures/semesters`, {
        params: { branch },
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ API Error (Semesters):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },

  // ✅ Fetch divisions by semester
  GetDivisionsByBranchSemester: async (branch, semester) => {
    try {
      console.log("Requesting divisions for:", branch, semester); // Debugging log

  
      const response = await axios.get(`${BASE_URL}/lectures/divisions`, {
        params: { branch, semester },
      });
  
      return response.data.divisions || [];
    } catch (error) {
      console.error(
        "❌ API Error (Divisions):",
        error.response?.data || error.message
      );
      return [];
    }
  },  

  // ✅ Fetch all subjects based on branch, semester, and division
  GetAllSubjectsByBranchSemesterDivision: async (
    branch,
    semester,
    division
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/lectures/subjects`, {
        params: { branch, semester, division },
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ API Error (Subjects):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },

  AddClassroom: async (branch, semester, division) => {
    try {
      const response = await axios.post(`${BASE_URL}/classroom/add-classroom`, {
        branch,
        semester,
        division,
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ API Error (Add Classroom):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },

  // ✅ Fetch attendance list for a given month and classroom
  GetAttendanceList: async (branch, semester, division, month, subject) => {
    try {
      if (!branch || !semester || !division || !month) {
        console.error("❌ Missing parameters:", {
          branch,
          semester,
          division,
          month,
        });
        return { success: false, message: "All parameters are required." };
      }

      // Send data to the API
      // const classroomResponse = await axios.post(
      //   `${BASE_URL}/classroom/get-classroomID`,
      //   {
      //     branch,
      //     semester,
      //     division,
      //     month,
      //   }
      // );

      // Extract classroomID
      // const classroomID = classroomResponse.data.classroomID;
     
      const response = await axios.post(
        `${BASE_URL}/attendance/show-attendance`,
        {
          branch,
          semester,
          division,
          month,
          subject,
        }
      );
      console.log("✅ API Response:", response.data);
      return response.data;

      // Return the classroom ID
      // return { success: true, classroomID };
    } catch (error) {
      console.error(
        "❌ API Error (Attendance List):",
        error.response?.data || error.message
      );
      return { success: false, message: error.message };
    }
  },
};

// // if (!classroomID) {
//   console.error("❌ No ClassroomID found for given parameters.");
//   return { success: false, message: "No matching classroom found." };
// }

// console.log("✅ Retrieved ClassroomID:", classroomID);

// // Now fetch attendance using ClassroomID
// console.log("📌 Fetching attendance for ClassroomID:", classroomID);

export default GlobalApi;
