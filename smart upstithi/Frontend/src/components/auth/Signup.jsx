import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import officeImage from "../../assets/img/create-account-office.jpeg";
import officeDarkImage from "../../assets/img/create-account-office-dark.jpeg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_IP; // For Vite







const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let navigate = useNavigate();
  console.log(BACKEND_URL)

   const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    if (!name || !email || !password || !cpassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Sending data:", { name, email, password });

    try {
      // **Step 1: Create User**
      const response = await fetch(`${BACKEND_URL}api/users/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log("Server Response:", json);

      if (!response.ok) {
        alert(`Error: ${json.error || "Signup failed"}`);
        return;
      }

      // **Step 2: Store Token & Faculty Info**
      localStorage.setItem("token", json.authtoken);

      const userData = {
        _id: json._id,
        name: json.name,
        email: json.email,
      };

      sessionStorage.setItem("signupData", JSON.stringify(userData));

      console.log("Saved Data:", sessionStorage.getItem("signupData"));

      // **Step 3: Redirect to Faculty Info Page**
      navigate("/signup/fill-info", { state: { email } });

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img className="object-cover w-full h-full dark:hidden" src={officeImage} alt="Office" />
            <img className="hidden object-cover w-full h-full dark:block" src={officeDarkImage} alt="Office" />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Create Account</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="text-gray-700 dark:text-gray-400">Full Name *</label>
                  <input type="text" name="name" className="form-control" onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="text-gray-700 dark:text-gray-400">Email Address *</label>
                  <input type="email" name="email" className="form-control" onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="text-gray-700 dark:text-gray-400">Password *</label>
                  <input type="password" name="password" className="form-control" onChange={onChange} required minLength={5} />
                </div>
                <div className="mb-3">
                  <label className="text-gray-700 dark:text-gray-400">Confirm Password *</label>
                  <input type="password" name="cpassword" className="form-control" onChange={onChange} required minLength={5} />
                </div>
                <button type="submit" className="block w-full px-4 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700">Sign Up</button>
              </form>
              <p className="mt-4 text-center">
                <Link className="text-purple-600 hover:underline" to="/login">Already have an account? Login</Link>
              </p>
              <div className="separator text-muted my-4 text-center">Or</div>
              {/* Social Login Buttons */}
              <div className="d-grid gap-2">
                <button
                  className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400"
                >
                  <i className="fab fa-google me-2"></i> Continue with Google
                </button>
                <button
                  className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400"
                >
                  <i className="fab fa-facebook-f me-2"></i> Continue with Facebook
                </button>
                <button
                  className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400"
                >
                  <i className="fab fa-github me-2"></i> Continue with GitHub
                </button>
                <button
                  className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400"
                >
                  <i className="fab fa-twitter me-2"></i> Continue with Twitter
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
