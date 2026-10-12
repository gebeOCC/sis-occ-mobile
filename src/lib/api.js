import axios from "axios";
import { useSessionStore } from "@/store/session";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api";

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useSessionStore.getState().signOut();
    return Promise.reject(error);
  },
);
