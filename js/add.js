import { dynamicMenu } from "./components/dynamicMenu.js";
import { getToken, getRole } from "./utils/storage.js";
import { viewMessage } from "./components/viewMessage.js";
import { createPreview } from "./components/createPreview.js";
import { addMovieToApi } from "./components/addMovieToApi.js";
import { searchMovieUrl, detailsMovieUrl } from "./settings/api.js";

const token = getToken();
if (token.length == 0) {
  location.href = "/";
}
const role = getRole();

if (role == "Registered" || role == "Public" || role == "Authenticated") {
  location.href = "/";
}

const form = document.querySelector("form");
const title = document.querySelector("#movieTitle");
const year = document.querySelector("#movieYear");
const genre = document.querySelector("#movieGenre");
const posterLink = document.querySelector("#moviePosterLink");
const description = document.querySelector("#movieDescription");
const imdb = document.querySelector("#IMDb-id");
const message = document.querySelector(".message-container");
const searchElem = document.querySelector("#search");
const preview = document.querySelector(".img-preview");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.innerHTML = "";

  const titleValue = title.value.trim();
  const yearValue = year.value;
  const genreValue = genre.value.trim();
  const descriptionValue = description.value.trim();
  const posterLinkValue = posterLink.value.trim();
  const imdbValue = imdb.value.trim();

  if (
    titleValue.length <= 1 ||
    yearValue.length < 4 ||
    genreValue.length <= 1 ||
    descriptionValue.length <= 1 ||
    posterLinkValue.length <= 1 ||
    imdbValue.length <= 1
  ) {
    viewMessage(
      "warning",
      "Require two character and four numbers on year",
      ".message-container"
    );
  } else {
    addMovieToApi(
      titleValue,
      yearValue,
      posterLinkValue,
      genreValue,
      descriptionValue,
      imdbValue
    );
  }
});

searchElem.addEventListener("keyup", () => {
  const inputValue = event.target.value;
  var d = new Date(inputValue);
  var year = d.getFullYear();
  var title = inputValue.replace(/\d+/g, "");
  if (searchElem.value.length >= 2) {
    getMovieId(title.trim(), year);
  }
});

async function getMovieId(title, year) {
  const url = searchMovieUrl + `&query=${title}&year=${year}`;
  console.log(url);

  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    if (json.results) {
      getMovieDetails(json.results[0].id);
      message.innerHTML = "";
    }

    if (json.errors) {
      viewMessage("warning", json.errors, ".message-container");
      preview.innerHTML = "";
    }

    if (searchElem.value.length == 0) {
      form.reset();
      preview.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
}

async function getMovieDetails(id) {
  const url =
    detailsMovieUrl + id + "?api_key=0e336e0a85a0361c6c6ce28bdce52748";
  console.log(url);
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);

    var date = new Date(json.release_date);
    var jsonYear = date.getFullYear();
    const basePosterUrl = "https://image.tmdb.org/t/p/w1280";
    const posterPath = json.poster_path;
    const posterUrl = basePosterUrl + posterPath;

    if (json.title) {
      title.value = json.title;
    } else {
      title.value = "Unknown";
    }

    if (jsonYear) {
      year.value = jsonYear;
    } else {
      year.value = "Unknown";
    }

    if (json.imdb_id) {
      imdb.value = json.imdb_id;
    } else {
      imdb.value = "No rating yet";
    }

    if (posterUrl) {
      posterLink.value = posterUrl;
    } else {
      posterLink.value = "Unknown";
    }

    if (json.genres[0]) {
      genre.value = json.genres[0].name;
    } else {
      genre.value = "No genre";
    }
    if (json.overview) {
      description.value = json.overview;
    } else {
      description.value = "Unknown";
    }

    preview.innerHTML = `
        <div><b>Poster Preview:</b></div>
        <img class="img" src="${posterUrl} " alt="Preview">
        `;
  } catch (error) {
    console.log(error);
  }
}

createPreview("#moviePosterLink");

dynamicMenu();
