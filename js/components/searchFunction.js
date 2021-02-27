import { createMovies } from "./createMovies.js";

const resultContainer = document.querySelector(".result-container");
const searchError = document.querySelector(".search-error");

export function searchFunction(json) {
  const input = document.querySelector("#searchField");
  input.addEventListener("keyup", (event) => {
    const inputValue = event.target.value.trim();
    console.log(inputValue.length);

    if (inputValue.length >= 3) {
      filterArray(json, inputValue);
      searchError.innerHTML = "";
    } else {
      searchError.innerHTML = "You need to type three character";
      createMovies(json, resultContainer);
    }
    if (inputValue.length == 0) {
      searchError.innerHTML = "";
    }
  });
}

function filterArray(json, value) {
  console.log(json);
  const sortedArray = json.filter(
    (movie) =>
      movie.year === value ||
      movie.title.toLowerCase() === value.toLowerCase() ||
      movie.title.toLowerCase() + " " + movie.year === value.toLowerCase()
  );

  if (sortedArray.length == 0) {
    resultContainer.innerHTML = `<p>Sorry, no movies with year or name <b>${value}</b> &#128554 </p>`;
  } else {
    createMovies(sortedArray, resultContainer);
  }
}
