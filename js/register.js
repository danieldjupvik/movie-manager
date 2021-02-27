import { viewMessage } from "./components/viewMessage.js";
import { saveToken, saveUser } from "./utils/storage.js";
import { url as baseUrl } from "./settings/api.js";
import { dynamicMenu } from "./components/dynamicMenu.js";

const form = document.querySelector("form");
const usernameElem = document.querySelector(".username");
const emailElem = document.querySelector(".email");
const passwordElem = document.querySelector(".password");
const messageContainer = document.querySelector(".message-container");

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  messageContainer.innerHTML = "";

  const usernameValue = usernameElem.value.trim();
  const emailValue = emailElem.value.trim();
  const passwordValue = passwordElem.value.trim();

  if (usernameValue.length < 2 || passwordValue.length < 6) {
    viewMessage(
      "warning",
      "Username require two character <br> Password require six character",
      ".message-container"
    );
  } else {
    createUser(usernameValue, emailValue, passwordValue);
  }
}

async function createUser(username, email, password) {
  const url = baseUrl + "auth/local/register";

  const data = JSON.stringify({
    username: username,
    email: email,
    password: password,
  });

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
    if (json.user) {
      console.log(json.jwt);
      saveToken(json.jwt);
      saveUser(json.user);
      location.href = "/";
    }
    if (json.error) {
      viewMessage(
        "error",
        `${json.message[0].messages[0].message}`,
        ".message-container"
      );
      usernameElem.value = "";
      emailElem.value = "";
      passwordElem.value = "";
    }
  } catch (error) {
    console.log(error);
  }
}

dynamicMenu();
