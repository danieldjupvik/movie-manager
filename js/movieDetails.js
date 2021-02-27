import { dynamicMenu } from "./components/dynamicMenu.js";
import { getToken, getRole } from "./utils/storage.js";
import { viewMessage } from "./components/viewMessage.js";
import { createPreview } from "./components/createPreview.js";
import { addMovieToApi } from "./components/addMovieToApi.js";
import { searchMovieUrl, detailsMovieUrl } from "./settings/api.js";
import { getMovieFromStorage } from "./utils/storage.js";
import { addMovieIdToLocalStorage } from "./components/addMovieIdToLocalStorage.js";

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

if (!id) {
  document.location.href = "/";
}
const resultContainer = document.querySelector(".result-container");
const recommendedContainer = document.querySelector(".recommended-container");
const apiKey = "?api_key=0e336e0a85a0361c6c6ce28bdce52748";

getMovieDetails();

async function getMovieDetails() {
  const url = detailsMovieUrl + id + apiKey;
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    createMovie(json, resultContainer);
  } catch (error) {
    console.log(error);
  }
}

function createMovie(movies, target) {
  target.innerHTML = "";

  var d = new Date(movies.release_date);
  var year = d.getFullYear();
  const basePosterUrl = "https://image.tmdb.org/t/p/original";
  const posterPath = movies.poster_path;
  let posterUrl = basePosterUrl + posterPath;
  const baseBackdropUrl = "https://image.tmdb.org/t/p/original";
  const backdropPath = movies.backdrop_path;
  let backdropUrl = baseBackdropUrl + backdropPath;
  let ifGenre = "Unknown Genre";
  let runtime = timeConvert(movies.runtime);
  function timeConvert(num) {
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let hourNaming = " hr ";
    if (rhours > 1) {
      hourNaming = " hrs ";
    }
    return rhours + hourNaming + rminutes + " min";
  }

  let ifExist = `
    <span class="imdbRatingPlugin imdb" data-user="ur61856352" data-title="${movies.imdb_id}" data-style="p4">
        <a href="https://www.imdb.com/title/${movies.imdb_id}/?ref_=plg_rt_1">
          <img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_31x14.png" alt=" ${movies.title} on IMDb" />
        </a>
      </span>
    `;
  if (!movies.imdb_id) {
    ifExist = "";
  }

  if (movies.poster_path == null) {
    posterUrl = "../img/no-poster.jpg";
  }

  if (movies.genres.length !== 0) {
    ifGenre = movies.genres[0].name;
  }

  target.innerHTML += `
  <div class="details-container" style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backdropUrl})">
    <div class="movies details">
      <img class="poster poster-details" src="${posterUrl}" alt="${movies.title}">
      <div class="content"> 
        <h1>${movies.title} (${year})</h1>
        <span>${ifGenre}</span>
        ${ifExist}
        <span class="runtime">${movies.status}</span>
        <span class="runtime">${runtime}</span>
        <p>${movies.overview}</p>
      </div>
    </div>
    <div class="cast-container"></div>
  </div>
    `;
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

/*




*/
getRecommendedMovies();

async function getRecommendedMovies() {
  const url = detailsMovieUrl + id + "/recommendations" + apiKey;

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    if (json.results) {
      if (json.results.length !== 0) {
        createRecommendedMovies(json.results, recommendedContainer);
      }
    }

    if (json.errors) {
      viewMessage("warning", json.errors, ".message-container");
      preview.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
}

function createRecommendedMovies(movies, target) {
  target.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    var d = new Date(movies[i].release_date);
    var year = d.getFullYear();
    const basePosterUrl = "https://image.tmdb.org/t/p/w1280";
    const posterPath = movies[i].poster_path;
    let posterUrl = basePosterUrl + posterPath;

    if (movies[i].poster_path == null) {
      posterUrl = "../img/no-poster.jpg";
    }

    target.innerHTML += `
    <div class="movies recommended-cards">
      <a class="details-link" href="./movie-details.html?id=${movies[i].id}">
        <img class="poster" src="${posterUrl}" alt="${movies[i].title}">
      </a>
      <a class="details-link" href="./movie-details.html?id=${movies[i].id}">
        <h1>${movies[i].title} </h1>
        <span>(${year})</span>
      </a>
    </div>
    `;
  }
}

const goBackBtn = document.querySelector(".goBackBtn");
goBackBtn.addEventListener("click", () => {
  window.history.back();
});

setTimeout(() => {
  const castContainer = document.querySelector(".cast-container");
  getCastList(castContainer);
}, 1000);

async function getCastList(target) {
  const url = detailsMovieUrl + id + "/credits" + apiKey;
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    createCast(json, target);
  } catch (error) {
    console.log(error);
  }
}

function createCast(movies, target) {
  const cast = movies.cast;

  for (let i = 0; i < 5; i++) {
    const basePosterUrl = "https://image.tmdb.org/t/p/original";
    const posterPath = cast[i].profile_path;
    let posterUrl = basePosterUrl + posterPath;
    if (!posterPath) {
      posterUrl = "../img/cast-placeholder.webp";
    }
    target.innerHTML += `
      <div class="cast-card">
        <img class="cast-image" src="${posterUrl}" alt="${cast[i].title}">
        <span>${cast[i].character}</span>
        <span> <b>${cast[i].name}</b></span>
      </div>
      `;
  }
}

dynamicMenu();
