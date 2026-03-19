import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // optional if using cookies
  headers:{
    "Content-Type":"application/json"
  }
});

export default API;