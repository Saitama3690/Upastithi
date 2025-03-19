import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";

function Layout() {
  return (
    <div className="d-flex">
      {/* Sidebar - Fixed on Medium+ Screens */}
      <div
        className="d-none d-md-block bg-light position-fixed h-100"
        style={{ width: "16rem" }}
      >
        <SideNav />
      </div>

      {/* Main Content (With Left Margin on Medium+ Screens) */}
      <div className="flex-grow-1" style={{ marginLeft: "16rem" }}>
        <Header /> 
        <Outlet /> {/* Renders the nested route components */}
      </div>
    </div>
  );
}

export default Layout;
