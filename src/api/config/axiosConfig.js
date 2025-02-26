import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getRefreshToken } from "../authApi";

const api = axios.create({
  baseURL: "https://localhost:7026/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const redirectToLoginWithMessage = (message) => {
  localStorage.setItem(
    "loginError",
    JSON.stringify({
      message,
      expires: Date.now() + 5000, // Lưu lỗi trong 5 giây
    })
  );
  localStorage.clear(); // Xóa token để tránh lặp vô hạn
  window.location.href = "/";
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.log(error);
    return true;
  }
};

// Biến lưu trữ promise của refresh token để tránh gọi nhiều lần
let refreshingToken = null;

// Hàm refresh token chỉ chạy một lần tại một thời điểm
const refreshAccessToken = async () => {
  if (!refreshingToken) {
    refreshingToken = (async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          redirectToLoginWithMessage(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
          );
          throw new Error("Login session expired");
        }
        const response = await getRefreshToken(refreshToken);
        if (response.businessCode === 2000) {
          localStorage.setItem("accessToken", response.data.accessToken);
          return response.data.accessToken;
        } else {
          redirectToLoginWithMessage(
            "Refresh token không hợp lệ. Vui lòng đăng nhập lại."
          );
          throw new Error("Refresh token invalid");
        }
      } catch (error) {
        redirectToLoginWithMessage(
          "Vui lòng đăng nhập lại. Có lỗi xảy ra: " + error
        );
        throw error;
      } finally {
        refreshingToken = null; // Reset biến sau khi hoàn thành
      }
    })();
  }
  return refreshingToken; // Trả về promise của refresh token
};

// Interceptor xử lý request
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch (error) {
        return Promise.reject(error);
      }
    } else if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
