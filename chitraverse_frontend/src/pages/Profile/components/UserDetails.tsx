import { useAuth } from "../../../context/AuthContext";

const UserDetails = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Cover Image Section */}
      <div className="relative">
        <div className="h-48 lg:h-64 bg-gray-300 rounded-lg shadow-md overflow-hidden">
          <img
            src={user?.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Avatar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* User Details Section */}
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
        <p className="text-gray-600 text-lg">{user?.fullname}</p>
        <p className="text-gray-600 text-lg">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserDetails;
