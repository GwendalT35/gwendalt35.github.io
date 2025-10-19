document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".linkContainer");
  const projectImage = document.querySelector(".projectImage");

  // Dictionnaire projet → { image, lien }
  const projectData = {
    "Volcom x Gazpacho": {
      img: "../assets/images/02_page_projets visuels/01_volcom.png",
      url: "../projets/volcom_x_gazpacho.html",
    },
    "Bureau des temps": {
      img: "../assets/images/02_page_projets visuels/02_bureau-des-temps.png",
      url: "../projets/bureau_des_temps.html"
    },
    "Rapport de stage": {
      img: "../assets/images/02_page_projets visuels/03_rapport-de-stage.png",
      url: "../projets/epok_design.html",
    },
    "L'autre Flamme": {
      img: "../assets/images/02_page_projets visuels/04_lautre-flamme.png",
      url: "../projets/lautre_flamme.html",
    },
    "Le Treizième Atelier": {
      img: "../assets/images/02_page_projets visuels/05_13e-Atelier.png",
      url: "../projets/le_treizieme_atelier.html",
    },
    "Rebranding Berthelot": {
      img: "../assets/images/02_page_projets visuels/06_berthelot.jpg",
      url: "../projets/rebranding_berthelot.html",
    },
    "Buddies": {
      img: "../assets/images/02_page_projets visuels/07_buddies.png",
      url: "../projets/buddies.html",
    },
    "Le P'tit Marché": {
      img: "../assets/images/02_page_projets visuels/08_le-ptit-marche.png",
      url: "../projets/le_ptit_marche.html",
    },
    "Tempora": {
      img: "../assets/images/02_page_projets visuels/09_Tempora.jpg",
      url: "../projets/tempora.html",
    },
    "We Ker": {
      img: "../assets/images/02_page_projets visuels/10_we-ker.jpg",
      url: "../projets/we_ker.html",
    },
    "Loopsie": {
      img: "../assets/images/02_page_projets visuels/11_loopsie.jpg",
      url: "../projets/loopsie.html",
    },
  };

  let hovering = false;

  links.forEach(link => {
    const name = link.querySelector(".textLink")?.textContent.trim();
    const data = projectData[name];
    if (!data) return;

    // Survol : affiche l’image
    link.addEventListener("mouseenter", () => {
      hovering = true;
      projectImage.src = data.img;
      projectImage.style.opacity = "1";
    });

    // Sortie : cache si on ne va pas sur un autre lien
    link.addEventListener("mouseleave", e => {
      hovering = false;
      const related = e.relatedTarget;
      if (related && related.closest(".linkContainer")) return;
      setTimeout(() => {
        if (!hovering) {
          projectImage.style.opacity = "0";
          projectImage.src = "";
        }
      }, 100);
    });

    // Clic : redirection
    link.addEventListener("click", () => {
      window.location.href = data.url;
    });

    // Curseur interactif
    link.style.cursor = "pointer";
  });
});
