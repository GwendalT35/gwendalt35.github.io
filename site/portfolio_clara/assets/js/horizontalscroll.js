document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  // Scroll vertical → horizontal
  main.addEventListener("wheel", (e) => {
    e.preventDefault();
    main.scrollLeft += e.deltaY * 2.5;
  }, { passive: false });

  // === Curseur dynamique gauche/droite intelligent ===
  document.addEventListener("mousemove", (e) => {
    const main = document.querySelector("main");
    const middle = window.innerWidth / 2;

    // Positions extrêmes du scroll horizontal
    const maxScroll = main.scrollWidth - main.clientWidth;
    const atStart = main.scrollLeft <= 0;
    const atEnd = main.scrollLeft >= maxScroll;

    // Cas 1 : le scroll est tout à gauche → bloqué vers la gauche
    if (e.clientX < middle && !atStart) {
      document.body.className = "mainCursorLeft";
    }
    // Cas 2 : le scroll est tout à droite → bloqué vers la droite
    else if (e.clientX >= middle && !atEnd) {
      document.body.className = "mainCursorRight";
    }
    // Cas 3 : aucune direction possible → curseur normal
    else {
      document.body.className = "";
    }
  });


  // Protection clic vidéo
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.style.pointerEvents = "auto"; // au cas où un parent bloque
    video.addEventListener("click", (e) => {
      console.log("video clicked");
      
      e.stopPropagation()});
  });

  // Navigation gauche/droite
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".imageContainer")) return;
    const middle = window.innerWidth / 2;

    if (e.clientX < middle)
    {
          main.scrollLeft -= window.innerWidth * 0.3;
    }
    else 
    {
          main.scrollLeft += window.innerWidth * 0.3;
    }
  });


  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.addEventListener("click", () => {
    footer.classList.toggle("is-open");
  });
});
