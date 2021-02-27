import { getMovieFromStorage, getRole } from "../utils/storage.js";
import { addMovieIdToLocalStorage } from "./addMovieIdToLocalStorage.js";
import { getUserName } from "../utils/storage.js";

export function createMovies(movies, target) {
  target.innerHTML = "";

  const currentMovies = getMovieFromStorage();
  const username = getUserName();
  const role = getRole();

  movies.forEach((movies) => {
    let dynamicClass = "far";
    let ifLoggedIn = "none";
    let hideElement = "block";

    const { pathname } = document.location;
    const doesMovieExist = currentMovies.find((movie) => {
      return parseInt(movie.id) === movies.id;
    });

    if (pathname == "/favorites.html") {
      hideElement = "none";
    }

    if (role == "Registered" || role == "Public" || role == "Authenticated") {
      hideElement = "none";
    }

    if (username) {
      ifLoggedIn = "inline-block";
    }

    if (doesMovieExist) {
      dynamicClass = "fa";
    }

    let ifExist = `
    <span class="imdbRatingPlugin imdb" data-user="ur61856352" data-title="${movies.imdb}" data-style="p4">
        <a href="https://www.imdb.com/title/${movies.imdb}/?ref_=plg_rt_1">
          <img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_31x14.png" alt=" ${movies.title} on IMDb" />
        </a>
      </span>
    `;
    if (movies.imdb === "No rating yet") {
      ifExist = "";
    }

    target.innerHTML += `
    <div class="movies">
      <img class="poster" src="${movies.poster}" alt="${movies.title}">
      <i class="${dynamicClass} fa-bookmark bookmark" data-id="${movies.id}"></i>
      <h1>${movies.title} </h1>
      <span>(${movies.year})</span>
      <span>${movies.genre}</span>
      ${ifExist}
      <p>${movies.description}</p>
      <div class="delete-container" style="display: ${hideElement}">
        <a class="delete-button" data-id="${movies.id}" style="display: ${ifLoggedIn}"><i class="far fa-trash-alt delete-icon"></i></a>
        <a class="edit-button" href="./edit.html?id=${movies.id}" style="display: ${ifLoggedIn}"><i class="far fa-edit"></i></a>
      </div>
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
