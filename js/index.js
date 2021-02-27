import { createMovies } from "./components/createMovies.js";
import { searchFunction } from "./components/searchFunction.js";
import { fetchApi } from "./components/fetchApi.js";
import { viewMessage } from "./components/viewMessage.js";
import { dynamicMenu } from "./components/dynamicMenu.js";
import { deleteMovieFromApi } from "./components/deleteMovieFromApi.js";

const resultContainer = document.querySelector(".result-container");

fetchApi().then(function (data) {
  const result = data.result;
  if (data.success === true) {
    createMovies(result, resultContainer);
    searchFunction(result);
    const delBtn = document.querySelectorAll(".delete-button");
    if (delBtn) {
      delBtn.forEach(function (button) {
        button.addEventListener("click", (event) => {
          const id = event.currentTarget.dataset.id;
          deleteMovieFromApi(id);
        });
      });
    }
  } else {
    viewMessage(
      "error",
      `<b>Error message:</b> ${data.error}`,
      ".result-container"
    );
  }
});

dynamicMenu();
