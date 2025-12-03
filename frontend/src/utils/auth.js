export const isLoggedIn = () => !!localStorage.getItem("user");

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
