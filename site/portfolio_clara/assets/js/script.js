const carousel = document.getElementById('myCarousel');

const images = carousel.querySelectorAll('img');
let current = 0;
const delay = 3000;
const transitionSpeed = 1000;

images.forEach((img, i) => {
  img.style.transform = `translateX(${i * 100}%)`;
  img.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
});

function slideNext() {
  current = (current + 1) % images.length;

  images.forEach((img, i) => {
  
    const offset = (i - current) * 100;
    img.style.transform = `translateX(${offset}%)`;
  });
}

setInterval(slideNext, delay);
