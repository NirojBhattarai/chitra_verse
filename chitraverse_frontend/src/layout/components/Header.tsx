import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-gray-200 text-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center py-4">
          {/* Search Bar (Hidden on Small Devices) */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                placeholder="Search..."
              />
              <FaSearch className="absolute left-3 top-2.5 text-red-600" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6 pl-9">
            <button className="relative">
              <FaBell className="w-8 h-6 text-red-600 hover:text-red-900" />
            </button>
            <button>
              <FaUserCircle className="w-8 h-8 text-red-600 hover:text-red-900" />
            </button>
          </div>
        </div>

        {/* Mobile View Search Bar */}
        <div className="sm:hidden flex items-center mt-2 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              placeholder="Search..."
            />
            <FaSearch className="absolute left-3 top-2.5 text-red-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
