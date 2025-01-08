import axios from "axios";

axios.defaults.withCredentials = true; 

export const fetchLikedVideos = async () => {
    const response = await axios.post('http://localhost:5000/api/v1/likes/viewlikedvideos');
    return response.data;
}