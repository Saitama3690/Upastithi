import React, { useState, useEffect } from "react";

function LoginHeader() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Toggle functions
  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
  const toggleNotificationsMenu = () => setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close all menus when clicking outside
  useEffect(() => {
    const closeMenus = (e) => {
      if (!e.target.closest(".menu-item")) {
        setIsNotificationsMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile Menu Button */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSideMenu}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd"></path>
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl focus-within:text-purple-500">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            
          </div>
        </div>

        {/* Header Buttons */}
        <ul className="flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <li>
            <button className="rounded-md focus:outline-none" onClick={toggleTheme} aria-label="Toggle theme">
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4 12a8 8 0 1012 0 8 8 0 00-12 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </li>

          {/* Notifications Menu */}
          <MenuItem
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
            }
            badgeCount={3}
            isOpen={isNotificationsMenuOpen}
            toggleMenu={toggleNotificationsMenu}
          />

          {/* Profile Menu */}
          <MenuItem
            icon={
              <img
                className="object-cover w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt="Profile"
              />
            }
            isOpen={isProfileMenuOpen}
            toggleMenu={toggleProfileMenu}
          />
        </ul>
      </div>
    </header>
  );
}

// Reusable MenuItem Component
function MenuItem({ icon, badgeCount, isOpen, toggleMenu }) {
  return (
    <li className="relative menu-item">
      <button className="relative rounded-md focus:outline-none" onClick={toggleMenu} aria-haspopup="true">
        {icon}
        {badgeCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full text-xs text-white">
            {badgeCount}
          </span>
        )}
      </button>
      {isOpen && (
        <ul className="absolute right-0 w-56 p-2 mt-2 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:bg-gray-700">
          <li className="flex px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <a href="#" className="flex w-full items-center">Option 1</a>
          </li>
          <li className="flex px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <a href="#" className="flex w-full items-center">Option 2</a>
          </li>
        </ul>
      )}
    </li>
  );
}

export default LoginHeader;
