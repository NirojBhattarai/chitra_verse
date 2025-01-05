import {
  FaHome,
  FaUser,
  FaList,
  FaVideo,
  FaHeart,
  FaTwitter,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";

import { SideBarProps } from "../../interfaces/interface";

const SideBar = ({ isSidebarOpen }: SideBarProps) => {
  return (
    <div
      className={` top-0 left-0 z-40 h-screen  ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-all ease-in-out duration-300 bg-gray-200 w-64`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <h1 className="text-transparent pl-4 text-green-900 font-extrabold text-center text-3xl sm:text-3xl md:text-3xl mb-4 flex items-center justify-center space-x-2">
          <span>
            Chitra<span className="text-red-700">Verse</span>
          </span>
        </h1>

        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="/home"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaHome className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">Home</span>
            </a>
          </li>
          <li>
            <a
              href="/subscriptions"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <MdSubscriptions className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Subscriptions
              </span>
            </a>
          </li>
          <li>
            <a
              href="/user-profile"
              className="flex items-center w-full p-3 text-black bg-slate-50 hover:bg-purple-200 rounded-md transition duration-10 shadow-md group"
            >
              <FaUser className="w-5 h-5 mx-2 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="text-center font-bold text-lg group-hover:scale-105 transform transition duration-10">
                User Profile
              </span>
            </a>
          </li>
          <li>
            <a
              href="/playlist"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaList className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Playlist
              </span>
            </a>
          </li>
          <li>
            <a
              href="/videos"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaVideo className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Videos
              </span>
            </a>
          </li>
          <li>
            <a
              href="/liked-videos"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaHeart className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Liked Videos
              </span>
            </a>
          </li>
          <li>
            <a
              href="/tweets"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaTwitter className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Tweets
              </span>
            </a>
          </li>
          <li>
            <a
              href="/liked-tweets"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-purple-200 group"
            >
              <FaHeart className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-900" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Liked Tweets
              </span>
            </a>
          </li>

          <li className="pt-12 lg:pt-20">
            <button
              onClick={() => {
                fetch("http://localhost:5000/api/v1/users/logout", {
                  method: "POST",
                  credentials: "include",
                })
                  .then((response) => {
                    if (response.ok) {
                      window.location.href = "/";
                    } else {
                      console.error("Logout failed");
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-red-200 group w-full"
            >
              <FaSignOutAlt className="w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-800" />
              <span className="ml-3 font-bold text-lg text-gray-800">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
