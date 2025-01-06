import { FaSearch, FaBell} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Header = () => {

  const { user, loading: authLoading } = useAuth();
  if (authLoading) {
      return <div>Loading...</div>;
    }
  
  return (
    <header className=" text-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center py-4">
          {/* Search Bar (Hidden on Small Devices) */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-8 pr-4 py-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:outline-none"
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
            {user && <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />}
          </div>
        </div>

        {/* Mobile View Search Bar */}
        <div className="sm:hidden flex items-center mt-2 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-purple-300 focus:outline-none"
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
