import { Outlet } from "react-router";
import SideBar from "../layout/components/SideBar";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

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
    <div className="flex min-h-screen">
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 bg-black opacity-50 sm:hidden z-30 transition-all duration-300`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`h-screen fixed lg:static top-0 left-0 z-40 w-64 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-gradient-to-t from-gray-50 via-gray-100 to-gray-200`}
      >
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`w-full sm:ml-64 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : ""
        }`}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-800 rounded-lg sm:hidden hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <span className="sr-only">Open sidebar</span>
          <FaBars className="w-6 h-6" />
        </button>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
