
import api from "./api";

export async function loginOwner(username, password) {
  const response = await api.post("/token/", { username, password });

  sessionStorage.setItem("devfolio_access", response.data.access);
  sessionStorage.setItem("devfolio_refresh", response.data.refresh);

  return response.data;
}

export function logoutOwner() {
  sessionStorage.removeItem("devfolio_access");
  sessionStorage.removeItem("devfolio_refresh");
}

export function isOwnerLoggedIn() {
  return Boolean(sessionStorage.getItem("devfolio_access"));
}

export async function refreshAccessToken() {
  const refresh = sessionStorage.getItem("devfolio_refresh");

  if (!refresh) {
    logoutOwner();
    return false;
  }

  try {
    const response = await api.post("/token/refresh/", { refresh });
    sessionStorage.setItem("devfolio_access", response.data.access);
    return true;
  } catch {
    logoutOwner();
    return false;
  }
}
