import { schools } from "./data.js";
import { applyFilters, buildCard } from "./ui.js";

const form = document.querySelector("#filter-form");
const resetButton = document.querySelector("#reset-button");
const resultsCount = document.querySelector("#results-count");
const cards = document.querySelector("#cards");
const mapContainer = document.querySelector("#map");
const map = L.map(mapContainer).setView([41.8781, -87.6298], 11);
const markersLayer = L.layerGroup().addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const readFilters = () => {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
};

const COORDS_KEY = "schoolCoords";

const getStoredCoords = () => {
  const stored = localStorage.getItem(COORDS_KEY);
  if (!stored) {
    return {};
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    return {};
  }
};

const storeCoords = (coords) => {
  localStorage.setItem(COORDS_KEY, JSON.stringify(coords));
};

const geocodeSchool = async (school) => {
  const cached = getStoredCoords();
  if (cached[school.id]) {
    return cached[school.id];
  }
  if (school.latitude && school.longitude) {
    return { lat: school.latitude, lon: school.longitude };
  }
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      school.address
    )}`
  );
  const results = await response.json();
  if (!results.length) {
    return null;
  }
  const coords = { lat: Number(results[0].lat), lon: Number(results[0].lon) };
  cached[school.id] = coords;
  storeCoords(cached);
  return coords;
};

const renderMapMarkers = async (filtered) => {
  markersLayer.clearLayers();
  const bounds = [];
  for (const school of filtered) {
    const coords = await geocodeSchool(school);
    if (!coords) {
      continue;
    }
    const marker = L.marker([coords.lat, coords.lon]).addTo(markersLayer);
    marker.bindPopup(`<strong>${school.name}</strong><br/>${school.address}`);
    bounds.push([coords.lat, coords.lon]);
  }
  if (bounds.length) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
};

const render = async () => {
  const filters = readFilters();
  const filtered = applyFilters(schools, filters);
  cards.innerHTML = "";
  filtered.forEach((school) => {
    cards.appendChild(buildCard(school));
  });
  resultsCount.textContent = `${filtered.length} school${
    filtered.length === 1 ? "" : "s"
  }`;
  await renderMapMarkers(filtered);
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
