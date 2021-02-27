import { getToken } from "../utils/storage.js";
import { url as baseUrl } from "../settings/api.js";

export function deleteMovieFromApi(id) {
  (async function () {
    const doDelete = confirm("Are you sure?");
    if (doDelete) {
      const url = baseUrl + "movies/" + id;
      const token = getToken();

      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(url, options);
        const json = await response.json();
        console.log(json);
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  })();
}
