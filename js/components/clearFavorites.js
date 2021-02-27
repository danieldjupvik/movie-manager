import { createMovies } from "./createMovies.js";
import { getMovieFromStorage } from "../utils/storage.js";
import { viewMessage } from "./viewMessage.js";

const clearBtn = document.querySelector(".btn");

export function clearFavorites() {
  clearBtn.addEventListener("click", () => {
    const check = confirm("Are you sure you want to delete all?");

    if (check) {
      localStorage.clear();
      const resultContainer = document.querySelector(".result-container");
      const clearBtn = document.querySelector(".clearButton-container");
      const favorites = getMovieFromStorage();
      createMovies(favorites, resultContainer);
      viewMessage(
        "none favorites",
        "You don't have any favorites yet &#128554",
        ".result-container"
      );
      clearBtn.style.display = "none";
    }
  });
}
