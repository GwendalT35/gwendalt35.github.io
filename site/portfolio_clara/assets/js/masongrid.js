// ===== Masonry Grid Vanilla JS (ordre naturel, sans animation) =====

// Sélection du conteneur
const grid = document.querySelector(".masongrid");

// Liste d'images
const images = [
  "assets/images/autre_sized/1.png",
  "assets/images/autre_sized/2.png",
  "assets/images/autre_sized/3.png",
  "assets/images/autre_sized/4.png",
  "assets/images/autre_sized/5.png",
  "assets/images/autre_sized/6.png",
  "assets/images/autre_sized/7.png",
  "assets/images/autre_sized/8.png",
  "assets/images/autre_sized/9.png",
  "assets/images/autre_sized/10.png",
  "assets/images/autre_sized/11.png",
  "assets/images/autre_sized/12.png",
  "assets/images/autre_sized/13.png",
  "assets/images/autre_sized/14.png",
  "assets/images/autre_sized/15.png",
  "assets/images/autre_sized/16.png",
  "assets/images/autre_sized/empty.png",
  "assets/images/autre_sized/empty.png",
  "assets/images/autre_sized/19.png",
];

// Paramètres
const columns = 4;
const gap = 16;

// Création des éléments
function createMasonryGrid() {
  if (!grid) return console.warn("⚠️ .masongrid introuvable dans le DOM");
  grid.innerHTML = "";

  images.forEach((src) => {
    const item = document.createElement("div");
    item.className = "mason-item";
    item.style.position = "absolute";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.style.width = "100%";
    img.style.display = "block";

    img.onload = () => layoutGrid(); // recalcul à chaque chargement
    item.appendChild(img);
    grid.appendChild(item);
  });
}

// Placement des images (ordre strict)
function layoutGrid() {
  const containerWidth = grid.offsetWidth;
  const columnWidth = (containerWidth - gap * (columns - 1)) / columns;
  const columnHeights = new Array(columns).fill(0);

  const items = grid.querySelectorAll(".mason-item");

  items.forEach((item, index) => {
    const img = item.querySelector("img");
    if (!img.naturalWidth) return;

    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const height = columnWidth * aspectRatio;

    // ordre strict : on remplit colonne 1 → 2 → 3 → 4 puis retour à 1
    const columnIndex = index % columns;
    const left = columnIndex * (columnWidth + gap);
    const top = columnHeights[columnIndex];

    item.style.width = `${columnWidth}px`;
    item.style.transform = `translate(${left}px, ${top}px)`;

    // pas d'animation, pas de transition
    item.style.transition = "none";

    columnHeights[columnIndex] += height + gap;
  });

  // Ajuste la hauteur du conteneur
  grid.style.height = `${Math.max(...columnHeights)}px`;
}

// Recalcul sur resize
window.addEventListener("resize", () => {
  layoutGrid();
});

// Initialisation
window.addEventListener("DOMContentLoaded", createMasonryGrid);
