import axios from "axios";

export const registerUser = async(userData) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/register', userData);
    return response.data;
};

export const loginUser = async(credentials) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/login',credentials);
    return response.data;
}