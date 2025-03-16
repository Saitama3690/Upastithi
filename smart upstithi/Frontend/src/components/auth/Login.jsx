import React, { useState, useRef } from "react";
import "../../assets/css/tailwind.output.css"; // Ensure the path is correct
import loginImage from "../../assets/img/login-office.jpeg";
import loginDarkImage from "../../assets/img/login-office-dark.jpeg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_IP; // For Vite

// Load environment variables from .env file
// dotenv.config();

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  
  // const username = useRef(null);
  // const password = useRef(null);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    
    e.preventDefault();
    console.log("BACKEND_URL:", BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      // Store auth token & user name in localStorage
      localStorage.setItem("token", json.authtoken);
      localStorage.setItem("userName", json.Name); // ✅ Fixed this line

      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* Left Side Image */}
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={loginImage}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={loginDarkImage}
              alt="Office"
            />
          </div>

          {/* Right Side Form */}
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>

              <form onSubmit={handleLogin}>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Email
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    aria-describedby="emailHelp"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Password
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="***************"
                  />
                </label>

                <button
                  type="submit"
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Log in
                </button>

                <hr className="my-8" />

                {/* Social Login Buttons */}
                <div className="d-grid gap-2">
                  <button className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400">
                    <i className="fab fa-google me-2"></i> Continue with Google
                  </button>

                  <button className="btn btn-light btn-block w-full border border-gray-300 dark:text-gray-400">
                    <i className="fab fa-github me-2"></i> Continue with GitHub
                  </button>
                </div>

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    href="./forgot-password"
                  >
                    Forgot your password?
                  </a>
                </p>
                <p className="mt-1">
                  <a
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    href="./signup"
                  >
                    Create account
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
