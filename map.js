import { schools } from "./data.js";
import { applyFilters, buildCard } from "./ui.js";

const form = document.querySelector("#filter-form");
const resetButton = document.querySelector("#reset-button");
const resultsCount = document.querySelector("#results-count");
const cards = document.querySelector("#cards");
const map = document.querySelector("#map");

const readFilters = () => {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
};

const renderMapMarkers = (filtered) => {
  map.innerHTML = "";
  const positions = [
    { top: "20%", left: "30%" },
    { top: "35%", left: "60%" },
    { top: "50%", left: "40%" },
    { top: "65%", left: "70%" },
    { top: "30%", left: "75%" },
    { top: "70%", left: "25%" },
  ];

  filtered.forEach((school, index) => {
    const marker = document.createElement("div");
    marker.className = "map-marker";
    const position = positions[index % positions.length];
    marker.style.top = position.top;
    marker.style.left = position.left;
    const label = document.createElement("span");
    label.textContent = school.name;
    marker.appendChild(label);
    map.appendChild(marker);
  });
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
  renderMapMarkers(filtered);
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
