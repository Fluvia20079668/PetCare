// utils/auth.js

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};

export const loginUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};
