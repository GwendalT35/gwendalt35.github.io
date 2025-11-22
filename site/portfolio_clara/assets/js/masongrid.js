const grid = document.querySelector(".masongrid");

const images = [
  { src: "assets/images/autre_sized/1.png",  categories: ["mockup"] },
  { src: "assets/images/autre_sized/2.png",  categories: ["photographie"] },
  { src: "assets/images/autre_sized/3.png",  categories: ["mockup", "photographie"] },
  { src: "assets/images/autre_sized/4.png",  categories: ["mockup", "photographie"] },
  { src: "assets/images/autre_sized/5.png",  categories: ["mockup"] },
  { src: "assets/images/autre_sized/6.png",  categories: ["photographie"] },
  { src: "assets/images/autre_sized/7.png",  categories: ["fantaisie"] },
  { src: "assets/images/autre_sized/8.png",  categories: ["fantaisie"] },
  { src: "assets/images/autre_sized/9.png",  categories: ["mockup"] },
  { src: "assets/images/autre_sized/10.png", categories: ["mockup", "photographie"] },
  { src: "assets/images/autre_sized/11.png", categories: ["mockup"] },
  { src: "assets/images/autre_sized/12.png", categories: ["fantaisie"] },
  { src: "assets/images/autre_sized/13.png", categories: ["fantaisie"] },
  { src: "assets/images/autre_sized/14.png", categories: ["mockup"] },
  { src: "assets/images/autre_sized/15.png", categories: ["mockup"] },
  { src: "assets/images/autre_sized/16.png", categories: ["fantaisie"] },
  { src: "assets/images/autre_sized/19.png", categories: ["mockup"] },
];

const gap = 16;

let activeFilter = "mockup";

function getColumnCount() {
  const w = window.innerWidth;
  if (w < 768) return 1;     
  return 4;                  
}

function createMasonryGrid() {
  if (!grid) {
    console.warn("⚠️ .masongrid introuvable dans le DOM");
    return;
  }

  grid.innerHTML = "";

  const filteredImages = images.filter((item) => {
    if (activeFilter === "all") return true;
    return item.categories.includes(activeFilter);
  });

  filteredImages.forEach((itemData) => {
    const item = document.createElement("div");
    item.className = "mason-item";
    item.style.position = "absolute";
    item.dataset.categories = itemData.categories.join(" ");

    const img = document.createElement("img");
    img.src = itemData.src;
    img.alt = itemData.categories.join(", ");
    img.style.width = "100%";
    img.style.display = "block";

    img.onload = () => layoutGrid();
    item.appendChild(img);
    grid.appendChild(item);
  });


  layoutGrid();
}

function layoutGrid() {
  if (!grid) return;

  const containerWidth = grid.offsetWidth;
  const cols = getColumnCount();
  const columnWidth = (containerWidth - gap * (cols - 1)) / cols;
  const columnHeights = new Array(cols).fill(0);

  const items = grid.querySelectorAll(".mason-item");

  items.forEach((item, index) => {
    const img = item.querySelector("img");
    if (!img || !img.naturalWidth) return;

    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const height = columnWidth * aspectRatio;

    const columnIndex = index % cols;
    const left = columnIndex * (columnWidth + gap);
    const top = columnHeights[columnIndex];

    item.style.width = `${columnWidth}px`;
    item.style.transform = `translate(${left}px, ${top}px)`;
    item.style.transition = "none";

    columnHeights[columnIndex] += height + gap;
  });

  if (columnHeights.length > 0) {
    grid.style.height = `${Math.max.apply(null, columnHeights)}px`;
  }
}

function setMasonryFilter(filterName) {
  activeFilter = filterName;
  createMasonryGrid();
}

window.addEventListener("DOMContentLoaded", () => {
  createMasonryGrid();

  const filterButtons = document.querySelectorAll(".btnFilter");
  filterButtons.forEach((btn) => {
  
    const label = btn.textContent.trim().toLowerCase();
    if (label === activeFilter) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      const filter = btn.textContent.trim().toLowerCase();

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      setMasonryFilter(filter);
    });
  });
});

window.addEventListener("resize", () => {
  layoutGrid();
});
