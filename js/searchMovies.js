import { dynamicMenu } from "./components/dynamicMenu.js";
import { getToken, getRole } from "./utils/storage.js";
import { viewMessage } from "./components/viewMessage.js";
import { createPreview } from "./components/createPreview.js";
import { addMovieToApi } from "./components/addMovieToApi.js";
import { searchMovieUrl, detailsMovieUrl } from "./settings/api.js";
import { getMovieFromStorage } from "./utils/storage.js";
import { addMovieIdToLocalStorage } from "./components/addMovieIdToLocalStorage.js";

const form = document.querySelector("form");
const title = document.querySelector("#movieTitle");
const year = document.querySelector("#movieYear");
const genre = document.querySelector("#movieGenre");
const posterLink = document.querySelector("#moviePosterLink");
const description = document.querySelector("#movieDescription");
const imdb = document.querySelector("#IMDb-id");
const message = document.querySelector(".message-container");
const searchElem = document.querySelector("#searchField");
const preview = document.querySelector(".img-preview");
const resultContainer = document.querySelector(".result-container");

searchElem.addEventListener("keyup", () => {
  const inputValue = event.target.value;
  var d = new Date(inputValue);
  var year = d.getFullYear();
  var title = inputValue.replace(/\d+/g, "");
  if (searchElem.value.length >= 2) {
    getMovieId(title.trim(), year);
  }
  if (searchElem.value.length == 0) {
    resultContainer.innerHTML = `<div class="empty-div"></div>
    `;
  }
});

searchElem.addEventListener("search", () => {
  resultContainer.innerHTML = `<div class="empty-div"></div>
  `;
});

async function getMovieId(title, year) {
  const url = searchMovieUrl + `&query=${title}&year=${year}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    if (json.results) {
      createPopularMovies(json.results, resultContainer);
    }

    if (json.errors) {
      viewMessage("warning", json.errors, ".message-container");
      preview.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
}

function createPopularMovies(movies, target) {
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

dynamicMenu();
