(function () {
  const menu   = document.querySelector('.menu');
  const burger = document.getElementById('burgerIcon');
  const nav    = document.getElementById('site-nav');
  if (!menu || !burger || !nav) return;

  function openNav(){
    menu.classList.add('is-open');

    nav.style.display = 'block';
    const h = nav.scrollHeight;
    nav.style.maxHeight = h + 'px';
  }

  function closeNav(){
    menu.classList.remove('is-open');
    nav.style.maxHeight = '0px';

  }

  function toggle(){
    if(menu.classList.contains('is-open')) closeNav(); else openNav();
  }

  burger.addEventListener('click', toggle);

  window.addEventListener('resize', () => {
    if(menu.classList.contains('is-open')){
      nav.style.maxHeight = 'none'
      const h = nav.scrollHeight;
      nav.style.maxHeight = h + 'px';
    }
  });
})();
