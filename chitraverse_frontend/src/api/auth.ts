import axios from "axios";

export const registerUser = async(userData:FormData) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/register', userData);
    return response.data;
};

export const loginUser = async(credentials:{
    email:String,
    password:String
}) => {
    const response = await axios.post('http://localhost:5000/api/v1/users/login',credentials);
    return response.data;
}