const carousel = document.getElementById('myCarousel');

const images = carousel.querySelectorAll('img');
let current = 0;
const delay = 3000; // durée entre les slides (ms)
const transitionSpeed = 1000; // durée de transition (ms)

// Mise en place des positions initiales
images.forEach((img, i) => {
  img.style.transform = `translateX(${i * 100}%)`;
  img.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
});

// Fonction pour faire défiler les images
function slideNext() {
  current = (current + 1) % images.length;

  images.forEach((img, i) => {
    // Calcul du décalage pour chaque image
    const offset = (i - current) * 100;
    img.style.transform = `translateX(${offset}%)`;
  });
}

setInterval(slideNext, delay);
