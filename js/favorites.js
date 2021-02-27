import { getMovieFromStorage } from "./utils/storage.js";
import { createMovies } from "./components/createMovies.js";
import { clearFavorites } from "./components/clearFavorites.js";
import { fetchApi } from "./components/fetchApi.js";
import { viewMessage } from "./components/viewMessage.js";
import { dynamicMenu } from "./components/dynamicMenu.js";

const resultContainer = document.querySelector(".result-container");
const clearBtn = document.querySelector(".clearButton-container");
const currentMovies = getMovieFromStorage();

fetchApi().then(function (data) {
  const result = data.result;
  if (data.success === true) {
    const filteredFavorites = result.filter(function (ApiResult) {
      return (
        currentMovies.filter(function (currentMovies) {
          return parseInt(currentMovies.id) == ApiResult.id;
        }).length !== 0
      );
    });

    if (filteredFavorites.length <= 0) {
      viewMessage(
        "none favorites",
        "You don't have any favorites yet &#128554",
        ".result-container"
      );
    } else {
      createMovies(filteredFavorites, resultContainer);
      clearBtn.style.display = "block";
    }
  } else {
    viewMessage(
      "error",
      `<b>Error message:</b> ${data.error}`,
      ".result-container"
    );
  }
});

clearFavorites();
dynamicMenu();
