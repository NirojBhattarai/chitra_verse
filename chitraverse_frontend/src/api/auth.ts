import axios from "axios";

axios.defaults.withCredentials = true; 

export const registerUser = async (userData: FormData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/register",
    userData
  );
  return response.data;
};

export const loginUser = async (credentials: {
  email: String;
  password: String;
}) => {
  const response = await axios.post(
    "http://localhost:5001/api/v1/users/login",
    credentials
  );
  return response.data;
};

export const fetchAuthenticatedUser = async () => {
  const response = await axios.post("http://localhost:5001/api/v1/users/viewuser");
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await axios.post(
    "http://localhost:5001/api/v1/users/refreshToken"
  );
  return response.data;
};


export const fetchVideos = async () => {
  const response = await axios.post('http://localhost:5001/api/v1/videos/view'); 
  return response.data.response.data; 
};