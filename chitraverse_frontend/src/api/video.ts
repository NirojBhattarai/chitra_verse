import axios from "axios";
axios.defaults.withCredentials = true; 

export const fetchVideos = async () => {
    const response = await axios.post('http://localhost:5000/api/v1/videos/view'); 
    return response.data.response.data; 
  };

  export const fetchVideosById = async (_id:string) => {
    const response = await axios.post(`http://localhost:5000/api/v1/videos/viewvideo`,
      _id
    );
    console.log(response.data);
    return response.data;
    
  }