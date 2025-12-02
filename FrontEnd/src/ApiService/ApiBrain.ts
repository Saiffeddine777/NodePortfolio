import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { apiUrl } from "../Urls.ts";
  

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

let onLogout: (() => void) | null = null;

export const setlogouthandler = (handler: () => void) => {
  onLogout = handler;
};

//need tho export intance to use it through the app
export const api: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token: string = localStorage.getItem("accessToken") as string;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res: AxiosResponse = await axios.post(
          `${apiUrl}/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.newAccessToken;

        if (!newAccessToken) {
          throw new Error("No new access token in response");
        }
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token invalid or expired:", refreshError);
        localStorage.removeItem("accessToken");
        onLogout ? onLogout() : undefined;
      }
    }
    return Promise.reject(error);
  }
);
