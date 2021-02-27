import { getToken } from "../utils/storage.js";
import { viewMessage } from "../components/viewMessage.js";
import { url as baseUrl } from "../settings/api.js";

const token = getToken();
const form = document.querySelector("form");
const preview = document.querySelector(".img-preview");
const message = document.querySelector(".message-container");

export async function addMovieToApi(
  title,
  year,
  poster,
  genre,
  description,
  imdb
) {
  const url = baseUrl + "movies";

  const data = JSON.stringify({
    title: title,
    year: year,
    genre: genre,
    poster: poster,
    description: description,
    imdb: imdb,
  });

  const options = {
    method: "POST",
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
    if (json.created_at) {
      viewMessage("success", "Movie added", ".message-container");
      form.reset();
      preview.innerHTML = "";
      setTimeout(() => {
        message.innerHTML = "";
      }, 5000);
    }

    if (json.error) {
      viewMessage(
        "error",
        `Error: ${json.error} <br> Code: ${json.statusCode}`,
        ".message-container"
      );
    }
  } catch (error) {
    viewMessage("error", `Error: ${error}`, ".message-container");
  }
}
