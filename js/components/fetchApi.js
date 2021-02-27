import { url as baseUrl } from "../settings/api.js";

export async function fetchApi() {
  const url = baseUrl + "movies";
  try {
    const response = await fetch(url);
    const json = await response.json();
    const result = json;
    return {
      success: true,
      result: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}
