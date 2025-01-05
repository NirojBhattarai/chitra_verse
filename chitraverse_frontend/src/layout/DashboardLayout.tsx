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

      <div
        className={`h-screen fixed lg:fixed top-0 left-0 z-40 w-64 transition-transform bg-gray-200 shadow-lg ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        id="default-sidebar"
      >
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "" : ""
        } flex flex-col`}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center z-40 p-2 mt-4 ml-3 text-sm text-gray-800 rounded-lg sm:hidden "
        >
          <FaBars className="w-6 h-6" />
        </button>
        <div className="fixed top-0 right-0 w-full bg-gray-200 z-30">
          <Header />
        </div>
        <div className="flex-1 lg:ml-64 overflow-y-auto bg-gray-200 rounded-lg shadow-lg pt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;