import { saveMovieToStorage, getMovieFromStorage } from "../utils/storage.js";

export function addMovieIdToLocalStorage() {
  const bookmarkButton = document.querySelectorAll(".bookmark");
  bookmarkButton.forEach((bookmarkButton) => {
    bookmarkButton.addEventListener("click", (event) => {
      event.target.classList.toggle("fa");
      event.target.classList.toggle("far");
      const id = event.target.dataset.id;

      const currentMovies = getMovieFromStorage();

      const ifMovieExist = currentMovies.find(function (movie) {
        return movie.id === id;
      });

      if (ifMovieExist === undefined) {
        const movies = {
          id: id,
        };
        currentMovies.push(movies);
        saveMovieToStorage(currentMovies);
      } else {
        const newMovies = currentMovies.filter((movie) => {
          return movie.id !== id;
        });
        saveMovieToStorage(newMovies);
      }
    });
  });
}
