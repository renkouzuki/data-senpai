import { ApiConfig } from "./types";

export const defaultApiConfig: ApiConfig = {
  login: {
    url: "/auth/login",
    method: "POST",
    params: ["email", "password"],
  },
  register: {
    url: "/auth/register",
    method: "POST",
    params: ["email", "password", "name"],
  },
  logout: {
    url: "/auth/logout",
    method: "POST",
    auth: true,
  },
  getProfile: {
    url: "/auth/me",
    method: "GET",
    auth: true,
    cache: "5 minutes",
  },
};
