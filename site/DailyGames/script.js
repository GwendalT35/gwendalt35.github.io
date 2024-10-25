window.addEventListener("load", (event) => {
  console.log("La page est complètement chargée");
  getData();

  document.querySelector(".menu-button").addEventListener("click", function () {
    const menu = document.getElementById("menu-container");
    if (menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      menu.classList.add("visible");
    } else {
      menu.classList.remove("visible");
      menu.classList.add("hidden");
    }
  });
});


async function getData() {
  const url = "./site.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    const container = document.getElementById('container');

    json.websites.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    json.websites.forEach(site => {
      // Créer un élément 'ul'
      const ul = document.createElement('ul');

      // Créer un élément 'li'
      const li = document.createElement('li');

      // Créer un élément 'a' avec l'attribut 'href'
      const link = document.createElement('a');
      link.href = site.url;

      // Créer un élément 'img' avec l'attribut 'src' et 'alt'
      const img = document.createElement('img');
      img.src = site.image;
      img.alt = site.name;

      // Ajouter l'image dans le lien
      link.appendChild(img);

      // Ajouter le lien dans la liste
      li.appendChild(link);

      // Ajouter la liste dans l'élément 'ul'
      ul.appendChild(li);

      // Ajouter l'élément 'ul' dans le conteneur
      container.appendChild(ul);
    });
  } catch (error) {
    console.error(error.message);
  }
}