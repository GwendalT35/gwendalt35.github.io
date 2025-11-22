document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  main.addEventListener("wheel", (e) => {
    e.preventDefault();
    main.scrollLeft += e.deltaY * 2.5;
  }, { passive: false });

  document.addEventListener("mousemove", (e) => {
    const main = document.querySelector("main");
    const middle = window.innerWidth / 2;
    const maxScroll = main.scrollWidth - main.clientWidth;
    const atStart = main.scrollLeft <= 0;
    const atEnd = main.scrollLeft >= maxScroll;

    if (e.clientX < middle && !atStart) {
      document.body.className = "mainCursorLeft";
    }

    else if (e.clientX >= middle && !atEnd) {
      document.body.className = "mainCursorRight";
    }

    else {
      document.body.className = "";
    }
  });


  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.style.pointerEvents = "auto"
    video.addEventListener("click", (e) => {
      console.log("video clicked");
      
      e.stopPropagation()});
  });

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
