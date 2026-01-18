import { schools } from "./data.js";
import { buildCard, getFavorites } from "./ui.js";

const cards = document.querySelector("#cards");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");

const render = () => {
  const favorites = new Set(getFavorites());
  const filtered = schools.filter((school) => favorites.has(school.id));
  cards.innerHTML = "";
  filtered.forEach((school) => {
    cards.appendChild(buildCard(school));
  });
  resultsCount.textContent = `${filtered.length} school${
    filtered.length === 1 ? "" : "s"
  }`;
  emptyState.hidden = filtered.length !== 0;
};

window.addEventListener("storage", render);
render();
