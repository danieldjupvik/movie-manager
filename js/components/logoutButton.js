import { userKey, tokenKey } from "../utils/keys.js";
export function logoutButton() {
  const btn = document.querySelector("#logout");
  if (btn) {
    btn.addEventListener("click", function () {
      const checkIfDelete = confirm("Sure you want to logout?");
      if (checkIfDelete) {
        localStorage.removeItem(userKey);
        localStorage.removeItem(tokenKey);
        location.href = "/";
      }
    });
  }
}
