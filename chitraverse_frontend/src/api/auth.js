import axios from "axios";

export const registerUser = async(userData) => {
    const response = await axios.post('auth/register', userData);
    return response.data;
};

export const loginUser = async(credentials) => {
    const response = await axios.post('auth/login',credentials);
    return response.data;
}