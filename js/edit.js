import { dynamicMenu } from "./components/dynamicMenu.js";
import { getToken, getRole } from "./utils/storage.js";
import { viewMessage } from "./components/viewMessage.js";
import { url as baseUrl } from "./settings/api.js";
import { createPreview } from "./components/createPreview.js";

const token = getToken();
if (token.length == 0) {
  location.href = "/";
}

const role = getRole();

if (role == "Registered" || role == "Public" || role == "Authenticated") {
  location.href = "/";
}

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

if (!id) {
  document.location.href = "/";
}

const movieUrl = baseUrl + "movies/" + id;

const form = document.querySelector("form");
const title = document.querySelector("#movieTitle");
const year = document.querySelector("#movieYear");
const genre = document.querySelector("#movieGenre");
const posterLink = document.querySelector("#moviePosterLink");
const description = document.querySelector("#movieDescription");
const imdb = document.querySelector("#IMDb-id");
const message = document.querySelector(".message-container");
const preview = document.querySelector(".img-preview");
const resultContainer = document.querySelector(".result-container");

(async function () {
  try {
    const response = await fetch(movieUrl);
    const json = await response.json();
    console.log(json);
    title.value = json.title;
    year.value = json.year;
    genre.value = json.genre;
    posterLink.value = json.poster;
    description.value = json.description;
    imdb.value = json.imdb;
    preview.innerHTML = `
    <div>
    <b>Poster Preview:</b>
    </div> 
    <img class="img" src="${json.poster}" alt="Preview">`;
  } catch (error) {
    console.log(error);
  } finally {
    resultContainer.style.display = "none";
    form.style.display = "inline-block";
  }
})();

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
    titleValue.length < 2 ||
    yearValue.length < 4 ||
    genreValue.length < 2 ||
    descriptionValue.length < 2 ||
    posterLinkValue.length < 2 ||
    imdbValue.length <= 1
  ) {
    viewMessage(
      "warning",
      "Require two characters <br> Require four numbers on year",
      ".message-container"
    );
  } else {
    updateMovie(
      titleValue,
      yearValue,
      posterLinkValue,
      genreValue,
      descriptionValue,
      imdbValue
    );
  }
});

async function updateMovie(title, year, poster, genre, description, imdb) {
  const url = baseUrl + "movies/" + id;

  const data = JSON.stringify({
    title: title,
    year: year,
    poster: poster,
    genre: genre,
    description: description,
    imdb: imdb,
  });

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);

    if (json.updated_at) {
      viewMessage("success", "The movie is updated", ".message-container");
      setTimeout(() => {
        message.innerHTML = "";
      }, 5000);
    }

    if (json.error) {
      viewMessage("error", json.error, ".message-container");
    }
  } catch (error) {
    console.log(error);
  }
}

createPreview("#moviePosterLink");

dynamicMenu();
