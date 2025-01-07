import { Outlet } from "react-router";
import SideBar from "../layout/components/SideBar";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Header from "./components/Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("default-sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-200">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-30 transition-all duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-full fixed top-0 left-0 z-40 w-56 lg:w-56 transition-transform bg-gray-200  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        id="default-sidebar"
      >
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-2 flex flex-col min-h-screen bg-gray-200">
        {/* Header */}
        <div className="fixed top-0 right-0 z-30 w-full bg-gray-200 text-white ">
          <div className="flex flex-row items-center justify-between">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="text-red-600 hover:text-red-900 focus:outline-none sm:hidden pl-2"
            >
              <FaBars className="mt-16 w-6 h-6" />
            </button>

            {/* Header Content */}
            <div className="flex-1 flex justify-center sm:justify-end items-center">
              <Header />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white flex-1 pt-16 lg:ml-64 md:ml-64 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
