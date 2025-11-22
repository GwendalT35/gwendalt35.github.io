(function () {
  const menu   = document.querySelector('.menu');
  const burger = document.getElementById('burgerIcon');
  const nav    = document.getElementById('site-nav');
  if (!menu || !burger || !nav) return;

  function openNav(){
    menu.classList.add('is-open');
    // anime en fonction du contenu réel
    nav.style.display = 'block';
    const h = nav.scrollHeight;
    nav.style.maxHeight = h + 'px';
  }

  function closeNav(){
    menu.classList.remove('is-open');
    nav.style.maxHeight = '0px';
    // après l’animation, on peut remettre display:none si tu veux, mais pas obligatoire
  }

  function toggle(){
    if(menu.classList.contains('is-open')) closeNav(); else openNav();
  }

  burger.addEventListener('click', toggle);

  // Recalc si on change d’orientation/taille (évite le nav coupé)
  window.addEventListener('resize', () => {
    if(menu.classList.contains('is-open')){
      nav.style.maxHeight = 'none'; // calc provisoire
      const h = nav.scrollHeight;
      nav.style.maxHeight = h + 'px';
    }
  });
})();
