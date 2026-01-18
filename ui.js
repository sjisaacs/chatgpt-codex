const FAVORITES_KEY = "favoriteSchoolIds";

export const getFavorites = () => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const isFavorite = (id) => getFavorites().includes(id);

export const toggleFavorite = (id) => {
  const favorites = new Set(getFavorites());
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
};

export const applyFilters = (schools, filters) => {
  const nicheScale = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
  ];
  const nicheMinimum = filters.nicheRating
    ? nicheScale.indexOf(filters.nicheRating)
    : -1;

  return schools.filter((school) => {
    if (filters.distance && school.distanceMiles > Number(filters.distance)) {
      return false;
    }
    if (filters.greatSchoolsRating) {
      if (
        school.greatSchoolsRating === null ||
        school.greatSchoolsRating < Number(filters.greatSchoolsRating)
      ) {
        return false;
      }
    }
    if (filters.nicheRating) {
      const schoolGradeIndex = school.nicheRating
        ? nicheScale.indexOf(school.nicheRating)
        : -1;
      if (schoolGradeIndex === -1 || schoolGradeIndex > nicheMinimum) {
        return false;
      }
    }
    if (filters.startGrade === "preK" && !school.preK) {
      return false;
    }
    if (filters.startGrade === "kPlus" && school.preK) {
      return false;
    }
    if (filters.publicType && school.publicType !== filters.publicType) {
      return false;
    }
    if (filters.selective) {
      const wantsSelective = filters.selective === "true";
      if (school.selective !== wantsSelective) {
        return false;
      }
    }
    if (filters.deadline) {
      const filterDate = new Date(filters.deadline);
      const schoolDate = new Date(school.deadline);
      if (schoolDate > filterDate) {
        return false;
      }
    }
    return true;
  });
};

export const buildCard = (school) => {
  const card = document.createElement("article");
  card.className = "school-card";
  card.setAttribute("data-school", school.id);
  card.setAttribute("tabindex", "0");
  const greatSchoolsLabel =
    school.greatSchoolsRating === null ? "N/A" : `${school.greatSchoolsRating}/10`;
  card.innerHTML = `
    <button class="favorite ${isFavorite(school.id) ? "active" : ""}" aria-label="Toggle favorite">
      ${isFavorite(school.id) ? "★" : "☆"}
    </button>
    <h3>${school.name}</h3>
    <p>${school.neighborhood}</p>
    <div class="rating-row">
      <span><strong>GreatSchools:</strong> ${greatSchoolsLabel}</span>
      <span><strong>Niche:</strong> ${school.nicheRating ?? "N/A"}</span>
    </div>
    <div class="tags">
      <span class="tag">${school.publicType}</span>
      <span class="tag">${school.selective ? "Selective" : "Open enrollment"}</span>
      <span class="tag">Starts ${school.startGrade}</span>
    </div>
    <div class="card-details">
      <div class="detail-grid">
        <div class="detail-block">
          <strong>Application deadline</strong>
          <div>${school.deadline}</div>
        </div>
        <div class="detail-block">
          <strong>School type</strong>
          <div>${school.schoolType}</div>
        </div>
        <div class="detail-block">
          <strong>Address</strong>
          <div>${school.address}</div>
        </div>
        <div class="detail-block">
          <strong>Enrollment</strong>
          <div>${school.enrollment}</div>
        </div>
        <div class="detail-block">
          <strong>Tuition</strong>
          <div>${school.tuition}</div>
        </div>
        <div class="detail-block">
          <strong>Student-teacher ratio</strong>
          <div>${school.studentTeacherRatio}</div>
        </div>
      </div>
      <div class="detail-block" style="margin-top: 0.75rem;">
        <strong>Application steps</strong>
        <div>${school.applicationInstructions}</div>
      </div>
      <div class="detail-block" style="margin-top: 0.75rem;">
        <strong>Program highlights</strong>
        <ul>
          ${school.programHighlights.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  const favoriteButton = card.querySelector(".favorite");
  favoriteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(school.id);
    const updated = isFavorite(school.id);
    favoriteButton.classList.toggle("active", updated);
    favoriteButton.textContent = updated ? "★" : "☆";
  });

  const toggleExpand = () => {
    card.classList.toggle("expanded");
  };

  card.addEventListener("click", toggleExpand);
  card.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleExpand();
    }
  });

  return card;
};
