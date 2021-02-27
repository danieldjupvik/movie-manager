import { viewMessage } from "./components/viewMessage.js";
import { dynamicMenu } from "./components/dynamicMenu.js";
import { topRatedMovieUrl } from "./settings/api.js";
import { detailsMovieUrl } from "./settings/api.js";
import { addMovieIdToLocalStorage } from "./components/addMovieIdToLocalStorage.js";
import { getMovieFromStorage, getUserName, getRole } from "./utils/storage.js";

const resultContainer = document.querySelector(".result-container");

const popularArray = [];
searchFunction(popularArray);

getMovieId();
async function getMovieId() {
  const url = topRatedMovieUrl;

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    if (json.results) {
      createTopRatedMovies(json.results, resultContainer);
      searchFunction(json.results);

      const input = document.querySelector("#searchField");
      input.addEventListener("search", () => {
        createTopRatedMovies(json.results, resultContainer);
      });
    }

    if (json.errors) {
      viewMessage("warning", json.errors, ".message-container");
      preview.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
}

function createTopRatedMovies(movies, target) {
  target.innerHTML = "";

  const currentMovies = getMovieFromStorage();

  movies.forEach((movies) => {
    let dynamicClass = "far";

    const doesMovieExist = currentMovies.find((movie) => {
      return parseInt(movie.id) === movies.id;
    });

    var d = new Date(movies.release_date);
    var year = d.getFullYear();
    const basePosterUrl = "https://image.tmdb.org/t/p/w1280";
    const posterPath = movies.poster_path;
    let posterUrl = basePosterUrl + posterPath;

    if (doesMovieExist) {
      dynamicClass = "fa";
    }

    if (movies.poster_path == null) {
      posterUrl = "../img/no-poster.jpg";
    }

    target.innerHTML += `
    <div class="movies clickable-movie">
      <a class="details-link" href="./movie-details.html?id=${movies.id}">
        <img class="poster" src="${posterUrl}" alt="${movies.title}">
      </a>
      <i class="${dynamicClass} fa-bookmark bookmark" data-id="${movies.id}"></i>
      <a class="details-link" href="./movie-details.html?id=${movies.id}">
        <h1>${movies.title} </h1>
        <span>(${year})</span>
        <p>${movies.overview}</p>
      </a>
    </div>
    `;
  });

  addMovieIdToLocalStorage();
  (function (d, s, id) {
    var js,
      stags = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src =
      "https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
    stags.parentNode.insertBefore(js, stags);
  })(document, "script", "imdb-rating-api");
}

const searchError = document.querySelector(".search-error");

function searchFunction(json) {
  const input = document.querySelector("#searchField");
  input.addEventListener("keyup", (event) => {
    const inputValue = event.target.value.trim();

    if (inputValue.length >= 3) {
      filterArray(json, inputValue);
      searchError.innerHTML = "";
    } else {
      searchError.innerHTML = "You need to type three character";
      createPopularMovies(json, resultContainer);
    }
    if (inputValue.length == 0) {
      searchError.innerHTML = "";
    }
  });
}

function filterArray(json, value) {
  const sortedArray = json.filter((movie) => {
    var d = new Date(movie.release_date);
    var year = JSON.stringify(d.getFullYear());
    return (
      year === value ||
      movie.title.toLowerCase() === value.toLowerCase() ||
      movie.title.toLowerCase() + " " + year === value.toLowerCase()
    );
  });
  console.log(sortedArray);
  if (sortedArray.length == 0) {
    resultContainer.innerHTML = `<p>Sorry, no movies with year or name <b>${value}</b> &#128554 </p>`;
  } else {
    createPopularMovies(sortedArray, resultContainer);
  }
}

dynamicMenu();
