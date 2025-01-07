import Playlist from "./components/Playlist";
import UserDetails from "./components/UserDetails";
import WatchHistory from "./components/WatchHistory";

function Profile() {
  return (
    <div className="container mx-auto px-2 py-12 lg:py-4 md:py-16">
      <UserDetails />
      <Playlist/>
      <WatchHistory/>
    </div>
  );
}

export default Profile;
