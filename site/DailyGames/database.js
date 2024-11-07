// Import des dépendances Firebase
import { firebaseConfig } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Initialisation de Firebase et de la base de données
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Écouteur de chargement de la fenêtre
window.addEventListener("load", (event) => {
    getGame();

    // Formulaire pour ajouter un score
    document.getElementById("scoreForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const game = document.getElementById("game").value.toUpperCase();
        const username = document.getElementById("username").value;
        const scoreResult = document.getElementById("scoreResult").value.toUpperCase();
        
        let firstLineGrapper = scoreResult.match(/(^#.*)|(.*?(\d+\s*\/\s*\d+))/g);
        let handleEmojiResult = firstLineGrapper.length > 1 ? firstLineGrapper[1].match(/(\D+)\/\d|(\d+)\/(\d+)/) : null;
        let goodResult = firstLineGrapper[0] + (handleEmojiResult ? " " + handleEmojiResult[0] : "");

        const data = {
            username: username,
            result: goodResult,
            date: new Date().toISOString()
        };

        try {
            const gameRef = ref(database, `games/${game}/scores`);
            await push(gameRef, data);
            alert("Data successfully saved!");
            document.getElementById("username").value = "";
            document.getElementById("scoreResult").value = "";
        } catch (error) {
            alert("Error adding document:", error);
        }
    });

    // Afficher les valeurs de la base de données
    document.getElementById("databaseList").addEventListener("change", function () {
        const selectedDatabase = this.value.toUpperCase();
        const podiumDiv = document.getElementById("podium");
        const listDiv = document.getElementById("scoreList");

        podiumDiv.innerHTML = "";
        listDiv.innerHTML = "";

        if (selectedDatabase) {
            const scoresRef = ref(database, `games/${selectedDatabase}/scores`);
            const gameNumberSelect = document.getElementById("gameNumberSelect");
            const gameNumbers = new Set();
            let scores = [];

            onValue(scoresRef, (snapshot) => {
                podiumDiv.innerHTML = "";
                listDiv.innerHTML = "";
                gameNumberSelect.innerHTML = "<option value=''>Select a day</option>";
            
                scores = []; // Réinitialiser les scores
            
                let gameNumbers = []; // Utilisation d'un tableau plutôt que d'un Set pour conserver l'ordre des jours
            
                snapshot.forEach((childSnapshot) => {
                    const record = childSnapshot.val();
            
                    let strScore = record.result.match(/(\D+)\/\d|(\d+)\/(\d+)/)[0];
                    let gameNumber = record.result.match(/#\d{1,}|\d{1,}/)[0];
            
                    scores.push({
                        username: record.username,
                        score: strScore, // Assurez-vous que le score est numérique
                        date: gameNumber
                    });
                    
                    gameNumbers.push(gameNumber);
                });
            
                // Trier les jours de manière décroissante (le plus récent d'abord)
                gameNumbers = Array.from(new Set(gameNumbers)); // Enlever les doublons
                gameNumbers.sort((a, b) => b.localeCompare(a)); // Tri décroissant (le plus récent en premier)
            
                // Ajouter les jours au selecteur
                gameNumbers.forEach(number => {
                    if (!number.match(/^#/)) number = "#"+number;
                    const option = document.createElement("option");
                    option.value = number;
                    option.textContent = `${number}`;
                    gameNumberSelect.appendChild(option);
                });
            
                // Sélectionner le jour le plus récent par défaut
                if (gameNumbers.length > 0) {
                    gameNumberSelect.value = gameNumbers[0]; // Sélectionne le plus récent
                }
            
                displayScores(scores); // Affiche tous les scores par défaut
            });
            

            // Fonction pour afficher les scores filtrés
            function displayScores(scores) {
                const selectedGameNumber = gameNumberSelect.value;
                
                // Filtrer les scores par numéro de jeu sélectionné
                const filteredScores = selectedGameNumber
                    ? scores.filter(record => record.date === selectedGameNumber)
                    : scores;
                
                // Trier les scores décroissants
                filteredScores.sort((a, b) => b.score - a.score);

                // Efface le contenu précédent
                podiumDiv.innerHTML = "";
                listDiv.innerHTML = "";

                filteredScores.forEach((record, index) => {
                    const recordDiv = document.createElement("div");
                    recordDiv.classList.add("record");

                    // Classes spécifiques pour le podium
                    if (index === 0) recordDiv.classList.add("first-place");
                    else if (index === 1) recordDiv.classList.add("second-place");
                    else if (index === 2) recordDiv.classList.add("third-place");
                    else recordDiv.classList.add("place");

                    recordDiv.innerHTML = `
                        <div class="record-details">
                            <div class="record-date">#${selectedDatabase} ${record.date}</div>
                            <div class="record-pseudo">${record.username}</div>
                            <div class="record-score">${record.score}</div>
                        </div>
                    `;

                    if (index < 3) {
                        podiumDiv.appendChild(recordDiv);
                    } else {
                        listDiv.appendChild(recordDiv);
                    }
                });
            }

            // Écouteur de changement de sélection pour recalculer le podium
            gameNumberSelect.addEventListener("change", () => {
                const selectedGameNumber = gameNumberSelect.value;

                // Si l'utilisateur a sélectionné "Select a day" (valeur vide), ne rien faire
                if (selectedGameNumber === "") {
                    return; // Aucune action ne sera entreprise
                }

                displayScores(scores); // Affiche les scores pour le jour sélectionné
            });

        }
    });
});

// Fonction pour récupérer les jeux
async function getGame() {
    const url = "./site.json";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const json = await response.json();
        const gameListe = document.getElementsByClassName('game')[0];
        const dbListe = document.getElementsByClassName('game')[1];

        json.websites.sort((a, b) => a.name.localeCompare(b.name));

        json.websites.forEach(site => {
            if (!site.classement) return;
            
            const optionGame = document.createElement('option');
            optionGame.value = site.name.toUpperCase();
            optionGame.textContent = site.name;
            gameListe.appendChild(optionGame);

            const optionDb = document.createElement('option');
            optionDb.value = site.name;
            optionDb.textContent = site.name;
            dbListe.appendChild(optionDb);
        });
    } catch (error) {
        console.error(error.message);
    }
}
