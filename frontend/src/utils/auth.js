//handling user authentication state in a frontend

//Retrieves the currently logged-in user from localStorage.
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
//Checks if a user is currently logged in.
export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};
//Logs in a user by saving their details to localStorage
export const loginUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};
//Logs out user
export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
//Updates or clears the user in localStorage.
export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};
