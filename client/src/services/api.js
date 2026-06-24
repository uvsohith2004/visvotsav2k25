import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"; 

console.log(BASE_URL)
const axiosInstance = axios.create({ baseURL: BASE_URL });

export const postQuery = async (data) => {
  return await axiosInstance.post("/api/queries", data);
};


export const postSubmit = async (data) => {
  const collegeName = data.college === "Other" ? data.customCollege : data.college;

  const payload = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    college: collegeName,
    eventType: data.eventType,
    event: data.event,
    branch: data.branch,
    duNumber: data.duNumber,
    participants: parseInt(data.participants),
    participantDetails: data.participantDetails || [], 
  };

  console.log("Final payload being sent to the server:", payload);


  return await axiosInstance.post("/api/form-submit", payload);
};

export const postGraduationRegistration = async (data) => {
  return await axiosInstance.post("/api/form-submit/graduation", data);
};
