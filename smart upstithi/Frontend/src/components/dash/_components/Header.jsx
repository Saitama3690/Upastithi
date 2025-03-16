"use client";
import React from "react";

function Header() {
  let name = "Guest";
  let email;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      name = decodedToken?.user?.name || "User";
      email = decodedToken?.user?.email;
      console.log("user name and name", decodedToken, name);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

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
      "#FFADAD",
      "#FFD6A5",
      "#FDFFB6",
      "#CAFFBF",
      "#9BF6FF",
      "#A0C4FF",
      "#BDB2FF",
      "#FFC6FF",
      "#FF69B4",
      "#FDCB58",
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
          userSelect: "none",
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="py-1 px-4 shadow-md border flex justify-between">
      <div></div>

      {/* User Avatar */}
      <div className="flex gap-2 items-center m-2">
        <Avatar name={name} size={50} />
        <div>
          <h2>{name}</h2>
          <h2 style={{ fontSize: "12px", color: "#bbbbbb" }}>{email}</h2>
        </div>
      </div>
    </div>
  );
}

export default Header;
