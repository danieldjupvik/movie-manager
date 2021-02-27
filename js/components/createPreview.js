export function createPreview(targetElement) {
  const posterLink = document.querySelector(targetElement);
  const preview = document.querySelector(".img-preview");

  posterLink.addEventListener("keyup", (event) => {
    const inputValue = event.target.value.trim();
    if (inputValue.length > 7) {
      preview.innerHTML = `
      <div><b>Poster Preview:</b></div>
      <img class="img" src="${posterLink.value} " alt="Preview">
      `;
    } else {
      preview.innerHTML = "";
    }
  });
}
