export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const loginUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
// Save user to localStorage after login
export function setUser(user) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}
export function logout() {
  localStorage.removeItem("user");
}