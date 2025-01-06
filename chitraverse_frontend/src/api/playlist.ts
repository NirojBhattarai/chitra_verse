import axios from "axios";

axios.defaults.withCredentials = true;

export const fetchPlaylists = async () => {
const response = await axios.post('http://localhost:5000/api/v1/playlists/viewplaylist');
return response.data.data;
}