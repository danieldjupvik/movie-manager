import { dynamicMenu } from "./components/dynamicMenu.js";
import { getUser, getToken } from "./utils/storage.js";
import { userKey, tokenKey } from "./utils/keys.js";
import { url as baseUrl } from "./settings/api.js";
import { viewMessage } from "./components/viewMessage.js";

const welcomeElm = document.querySelector(".welcome");
const profileElem = document.querySelector(".profile-div");
const passwordChangeElem = document.querySelector(".passwordChange-div");
const user = getUser();
const token = getToken();
const userId = user.id;

if (!user) {
  location.href = "/";
}
(async function () {
  const url = baseUrl + "users/me";

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
    if (json.created_at) {
      const createdTime = convertTime(json.created_at);
      const updatedTime = convertTime(json.updated_at);
      let emailConfirmed = "";
      if (user.confirmed == true) {
        emailConfirmed = "Yes";
      } else {
        emailConfirmed = "No";
      }
      welcomeElm.innerHTML = `Welcome, ${json.username}`;
      profileElem.innerHTML = `
      <form class="profile-form">
        <h3>Profile Information</h3>
        <div class="form-group">
          <label>Username</label>
          <input class="form-control username"></input>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control email"></input>
        </div>
        <div class="form-group">
          <label>Email Confirmed</label>
          <li class="form-control">${emailConfirmed}</li>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Created</label>
            <li class="form-control">${createdTime}</li>
          </div>
          <div class="form-group col-md-6">
            <label>Updated</label>
            <li class="form-control">${updatedTime}</li>
          </div>
        </div>
        <div class="form-group">
          <label>Account Type</label>
          <li class="form-control">${json.role.name}</li>
        </div>
        <button type="submit" class="btn btn-primary updateBtn">Update Profile</button>
      </form>

      `;
      passwordChangeElem.innerHTML = `
      <form class="password-form">
        <h3 class="changePassword-title">Change Password</h3>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" class="form-control newPassword"></input>
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" class="form-control newConfirmPassword"></input>
        </div>
        <button type="submit" class="btn btn-primary changePwBtn">Change password</button>
        <div class="button-container">
          <button type="button" class="btn btn-danger deleteUserBtn"> Delete profile</button>
        </div>
      </form>
      `;

      const changePwBtn = document.querySelector(".password-form");
      changePwBtn.addEventListener("submit", () => {
        event.preventDefault();
        const passwordElem = document.querySelector(".newPassword");
        const confPasswordElem = document.querySelector(".newConfirmPassword");
        const message = document.querySelector(".profile-message");
        const passwordValue = passwordElem.value.trim();
        const confPasswordValue = confPasswordElem.value.trim();

        if (passwordValue.length > 6 && confPasswordValue.length > 6) {
          if (passwordElem.value == confPasswordElem.value) {
            resetPassword(passwordValue, confPasswordValue);
            viewMessage("success", `Password is changed`, ".message-container");
            passwordElem.value = "";
            confPasswordElem.value = "";
            message.innerHTML = "";
          } else {
            viewMessage(
              "error",
              `confirmed password needs to match password`,
              ".profile-message"
            );
          }
        } else {
          viewMessage(
            "error",
            `Password needs to be 5 characters`,
            ".profile-message"
          );
        }
      });

      const btn = document.querySelector(".deleteUserBtn");
      btn.addEventListener("click", () => {
        const checkIfDelete = confirm(
          `Sure you want to delete ${json.username}? NB! This can't be undone`
        );
        if (checkIfDelete) {
          deleteUser();
        }
      });
      const usernameElem = document.querySelector(".username");
      const emailElem = document.querySelector(".email");

      usernameElem.value = json.username;
      emailElem.value = json.email;

      const updateBtn = document.querySelector(".profile-form");
      updateBtn.addEventListener("submit", () => {
        event.preventDefault();
        if (usernameElem.value.length >= 3) {
          updateProfileInfo(usernameElem.value, emailElem.value);
        } else {
          viewMessage(
            "error",
            `Username require 3 characters`,
            ".profile-message"
          );
        }
      });
    }
    if (json.error) {
      viewMessage("error", `${json.message}`, ".message-container");
      passwordElem.value = "";
    }
  } catch (error) {
    console.log(error);
  }
})();

function convertTime(dateToConvert) {
  var d = new Date(dateToConvert);
  var date = d.toLocaleDateString();
  var time = d.toLocaleTimeString();
  var dateAndTime = date + " " + time;
  return dateAndTime;
}

async function deleteUser() {
  const url = baseUrl + "users/" + userId;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
    if (json.created_at) {
      localStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
      location.href = "/";
    }
    if (json.error) {
      viewMessage("error", `${json.message}`, ".profile-message");
      passwordElem.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}

async function resetPassword(password, confirmedPassword) {
  const url = baseUrl + "users/" + userId;

  const data = JSON.stringify({
    password: password,
    passwordConfirmation: confirmedPassword,
  });

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
    if (json.created_at) {
    }
    if (json.error) {
      viewMessage("error", `${json.message}`, ".profile-message");
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateProfileInfo(username, email) {
  const url = baseUrl + "users/" + userId;

  const data = JSON.stringify({
    username: username,
    email: email,
  });

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
    if (json.created_at) {
      viewMessage("success", `Profile Updated`, ".profile-message");
      location.reload();
    }
    if (json.error) {
      viewMessage(
        "error",
        `${json.data[0].messages[0].message}`,
        ".profile-message"
      );
    }
  } catch (error) {
    console.log(error);
  }
}
dynamicMenu();
