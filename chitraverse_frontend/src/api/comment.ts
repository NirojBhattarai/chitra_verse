import axios from "axios";

axios.defaults.withCredentials = true;

export const fetchComments = async () => {
const response = await axios.post('http://localhost:5000/api/v1/comments/view');
return response.data.data;
}