import { schools } from "./data.js";
import { applyFilters, buildCard } from "./ui.js";

const form = document.querySelector("#filter-form");
const resetButton = document.querySelector("#reset-button");
const resultsCount = document.querySelector("#results-count");
const cards = document.querySelector("#cards");

const readFilters = () => {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
};

const render = () => {
  const filters = readFilters();
  const filtered = applyFilters(schools, filters);
  cards.innerHTML = "";
  filtered.forEach((school) => {
    cards.appendChild(buildCard(school));
  });
  resultsCount.textContent = `${filtered.length} school${
    filtered.length === 1 ? "" : "s"
  }`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

resetButton.addEventListener("click", () => {
  form.reset();
  render();
});

render();
