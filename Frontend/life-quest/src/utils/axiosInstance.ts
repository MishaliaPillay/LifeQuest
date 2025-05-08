import axios from "axios";

export const getAxiosInstance = () =>
  axios.create({
    baseURL: "https://lifequest-backend.onrender.com",
    headers: {
      "Content-Type": "application/json",
    },
  });
