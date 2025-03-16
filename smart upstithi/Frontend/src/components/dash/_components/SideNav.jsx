"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartNoAxesCombined, GraduationCap, EyeIcon, FilePenLine, LayoutIcon, School2, Laugh } from 'lucide-react';

// Function to extract initials
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Function to generate a random background color
const getRandomColor = () => {
  const colors = [
    "#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF",
    "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FF69B4", "#FDCB58"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Avatar Component
const Avatar = ({ name, size = 50 }) => {
  const initials = getInitials(name);
  const bgColor = getRandomColor();

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: "#fff",
        fontWeight: "bold",
        fontSize: size / 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        textTransform: "uppercase",
        userSelect: "none"
      }}
    >
      {initials}
    </div>
  );
};

function SideNav() {
  // Extract user name from token
  let name = "Guest";
  let email
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      name = decodedToken?.user?.name || "User";
      email = decodedToken?.user?.email;
      console.log("user name and name", decodedToken, name)
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Sidebar menu items
  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutIcon, path: '/dashboard' },
    { id: 2, name: 'Add Students', icon: GraduationCap, path: '/dashboard/addStudent' },
    { id: 3, name: 'Statistics', icon: ChartNoAxesCombined, path: '/dashboard/statistics' },
    { id: 4, name: 'Show Attendance', icon: EyeIcon, path: '/dashboard/show-attendance' },
    { id: 5, name: 'Update student', icon: FilePenLine, path: '/dashboard/update-student' },
    { id: 6, name: 'Add Lecture', icon: School2, path: '/dashboard/add-lecture' },
    { id: 7, name: 'Face Detection', icon: School2, path: '/dashboard/face-detection' },
    { id: 8, name: 'Add Attendance', icon: Laugh, path: '/dashboard/Add-attendance' },
  ];

  return (
    <div className='border shadow-md h-screen p-3'>
      {/* Logo Section */}
      <div className='flex'>
        <img src={'/logo.svg'} style={{ width: 50, height: 50 }} alt='logo' />
        <h3 className='p-2 text-2xl font-bold'>Upastithi</h3>
      </div>
      <hr className='my-3' />

      {/* Sidebar Menu */}
      {menuList.map((menu) => (
        <Link to={menu.path} key={menu.id} className="block">
          <h2
            className="flex items-center gap-2 p-3 rounded-md cursor-pointer text-slate-500"
            style={{
              transition: "background 0.2s ease-in-out",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E5E7EB"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <menu.icon className="w-5 h-5" />
            {menu.name}
          </h2>
        </Link>
      ))}

      {/* User Avatar */}
      <div className="flex gap-2 items-center mt-5">
        <Avatar name={name} size={50} />
        <div>

        <h2 >
          {name}
        </h2>
        <h2 style={{ fontSize: '12px', color: '#bbbbbb' }}>
                  {email}
        </h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
