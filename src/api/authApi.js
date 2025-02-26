import axios from "axios";
import api from "./config/axiosConfig";

const signin = async (signinRequest) => {
  const response = await api.post(`user/login`, signinRequest);
  return response.data;
};

const signup = async (signupRequest) => {
  const response = await api.post(`user/sign-up`, signupRequest);
  return response.data;
};

const getRefreshToken = async (refreshToken) => {
  const response = await axios.post(
    `https://localhost:7026/api/user/refresh-token?refreshToken=${refreshToken}`
  );
  return response.data;
};
export { signin, signup, getRefreshToken };
