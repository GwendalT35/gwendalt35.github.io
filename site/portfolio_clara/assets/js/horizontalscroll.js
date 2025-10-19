document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  // Scroll vertical → horizontal
  main.addEventListener("wheel", (e) => {
    e.preventDefault();
    main.scrollLeft += e.deltaY;
  }, { passive: false });

  // Curseur dynamique gauche/droite
  document.addEventListener("mousemove", (e) => {
    const middle = window.innerWidth / 2;
    document.body.className =
      e.clientX < middle ? "mainCursorLeft" : "mainCursorRight";
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
    if (e.target.closest("video")) return; // bloque le changement de page
    console.log(e.target.closest("video"));
    
    const middle = window.innerWidth / 2;
    const previousBtn = document.querySelector(".previous-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (e.clientX < middle && previousBtn) {
      window.location.href = previousBtn.href;
    } else if (e.clientX >= middle && nextBtn) {
      window.location.href = nextBtn.href;
    }
  });
});
