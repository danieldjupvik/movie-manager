import { getUserName, getRole } from "../utils/storage.js";
import { logoutButton } from "./logoutButton.js";

export function dynamicMenu() {
  const navbar = document.querySelector(".navbar-nav");
  const { pathname } = document.location;
  const username = getUserName();
  const role = getRole();

  let loginActive = "";
  let addActive = "";
  let homeActive = "";
  let favoritesActive = "";
  let registerActive = "";
  let hideElement = "";
  let profileActive = "";

  if (pathname === "/login.html") {
    loginActive = "active";
  }
  if (pathname === "/add.html") {
    addActive = "active";
  }
  if (pathname === "/profile.html") {
    profileActive = "active";
  }
  if (pathname === "/index.html" || pathname === "/") {
    homeActive = "active";
  }
  if (pathname === "/favorites.html") {
    favoritesActive = "active";
  }
  if (pathname === "/register.html") {
    registerActive = "active";
  }
  if (role == "Registered" || role == "Public" || role == "Authenticated") {
    hideElement = "none";
  }

  let loginSection = `
  <li class="nav-item">
    <a href="login.html" class="${loginActive} nav-link">Login</a>
  </li>
  `;

  if (username) {
    loginSection = `
    <li class="nav-item" style="display: ${hideElement}">
      <a href="add.html" class="${addActive} nav-link">Add Movie</a>
    </li>
    <li class="nav-item">
      <a href="profile.html" class="${profileActive} nav-link">Profile</a>
    </li>
    <button class="btn btn-secondary" id="logout"><i class="fas fa-sign-out-alt"></i> Logout ${username}</button>
    `;
  }

  navbar.innerHTML = `
    <li class="nav-item">
      <a href="/" class="${homeActive} nav-link">Home</a>
    </li>
    <li class="nav-item">
      <a href="favorites.html" class="${favoritesActive} nav-link">Favorites</a>
    </li>
    <li class="nav-item">
      <a href="register.html" class="${registerActive} nav-link">Register</a>
    </li>
    ${loginSection}
  `;
  logoutButton();
}
