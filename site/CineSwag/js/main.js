import TmdbApi from "./classes/TmdbApi.js";
import { tmdbConfig } from './config.js';

const domFilmList = document.getElementById("filmList");
const searchInput = document.getElementById("filmToSearch");
const btnSubmit = document.getElementById("btnSubmit");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const selectLang = document.getElementById("selectLang");

let tmdb = new TmdbApi(tmdbConfig.apiKey);
let state = "suggestion";  // Keeps track of the state (whether we're viewing suggestions or search results)
let pageNumber = 1;
let maxPageNumber = 0;
let selectedLanguage = "fr-FR";

function clearList() {
    let list = document.querySelectorAll("li");
    list.forEach(element => {
        element.remove();
    });
}

function showFilmList(filmList) {
    if (filmList.length === 0) {
        const noResultsMessage = document.createElement("li");
        noResultsMessage.innerText = "Aucun film trouvé.";
        noResultsMessage.classList.add("no-results");
        domFilmList.appendChild(noResultsMessage);
        return;
    }

    filmList.forEach(film => {
        let listItem = document.createElement("li");
        listItem.classList.add("film-item");

        let poster = document.createElement("img");
        poster.src = film.poster_path 
            ? `https://image.tmdb.org/t/p/w200${film.poster_path}`
            : "./image/placeholder.png"; // Placeholder if no poster available
        poster.alt = `${film.title} poster`;

        let title = document.createElement("h3");
        title.innerText = film.title;

        let overview = document.createElement("p");
        overview.innerText = film.overview || "Pas de description disponible.";

        listItem.appendChild(poster);
        listItem.appendChild(title);
        listItem.appendChild(overview);

        domFilmList.appendChild(listItem);
    });
}


// Discover movies function with error handling
async function discover(page) {
    clearList();
    try {
        let filmList = await tmdb.discoverMovies(page, selectedLanguage);  // Use await to handle the promise
        if(filmList && filmList.results) {
            maxPageNumber = filmList.total_pages;
            showFilmList(filmList.results);  // Show the films based on the response
        } else {
            showFilmList([]);  // If no results, show a message
        }
    } catch (error) {
        console.error("Error fetching discovery movies:", error);
        showFilmList([]);  // Handle the error gracefully by showing an empty list
    }
}

// Search movies function with error handling
async function search() {
    clearList();
    try {
        let searchFilmList = await tmdb.searchMovies(searchInput.value, pageNumber, selectedLanguage);
        if (searchFilmList && searchFilmList.results) {
            showFilmList(searchFilmList.results);
            state = "search";
            maxPageNumber = searchFilmList.total_pages;
        } else {
            showFilmList([]); // Si aucune donnée n'est renvoyée
        }
    } catch (error) {
        console.error("Erreur pendant la recherche :", error);
        showFilmList([]);
    }
}


// Event listener for DOMContentLoaded to show suggested movies on page load
document.addEventListener("DOMContentLoaded", () => {
    discover(pageNumber);
});

// Event listener for Submit button click to trigger search
btnSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if(searchInput.value.trim() === "") {
        alert("Please enter a movie title to search.");
        return;
    }
    pageNumber = 1;
    search();
});

// Event listener for Previous button to navigate through pages
btnPrevious.addEventListener("click", () => {
    if(state === "suggestion" && pageNumber > 1) {
        pageNumber -= 1;
        discover(pageNumber);
    }
    else if(state === "search" && pageNumber > 1) {
        pageNumber -= 1;
        search();
    }
});

// Event listener for Next button to navigate through pages
btnNext.addEventListener("click", () => {
    console.log(state === "search" && pageNumber < maxPageNumber);
    
    if(state === "suggestion" && pageNumber < maxPageNumber) {
        pageNumber += 1;
        discover(pageNumber);
    }
    else if(state === "search" && pageNumber < maxPageNumber) {
        pageNumber += 1;
        search();
    }
});


selectLang.addEventListener('change', () => {
    selectedLanguage = selectLang.value;
    if ( state === "suggestion") discover(pageNumber);
    else if (state === "search") search();
})