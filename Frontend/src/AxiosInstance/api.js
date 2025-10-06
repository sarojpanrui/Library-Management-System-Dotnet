// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5292/api", // backend base URL
  withCredentials: false, // set true if using cookies for auth
});

 const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("payload"); // optional if you stored payload
    navigate("/login");
    toast.success("Logged out successfully");
    // redirect to login page
  };



// 🔹 Request Interceptor - attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor - handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignore errors not caused by authorization
    if (!error.response) return Promise.reject(error);

    // Access token expired
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        // Send refresh token in body (always JSON!)
        const res = await axios.post(
          "http://localhost:5292/api/Auth/refresh-token",
          { refreshToken } // ✅ backend should accept an object
        );

        const { token: newToken, refreshToken: newRefreshToken } = res.data;

        if (!newToken || !newRefreshToken) {
          throw new Error("Invalid refresh token response");
        }

        // Save new tokens
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed or expired:", refreshError);
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    // If refresh token itself expired or invalid
    if (error.response.status === 403) {
      console.warn("Refresh token expired or invalid, logging out...");
      logout();
    }

    return Promise.reject(error);
  }
);

export default api;
