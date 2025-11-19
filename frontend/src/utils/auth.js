// simple auth helpers using localStorage
export function setUser(user) {
  localStorage.setItem("petcare_user", JSON.stringify(user));
}

export function getUser() {
  const s = localStorage.getItem("petcare_user");
  return s ? JSON.parse(s) : null;
}

export function clearUser() {
  localStorage.removeItem("petcare_user");
}

export function isLoggedIn() {
  return Boolean(getUser());
}
