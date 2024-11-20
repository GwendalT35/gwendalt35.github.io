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

        // Échapper les caractères spéciaux pour éviter des erreurs dans la regex
        const escapedGame = game.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Créer la regex dynamiquement
        const regex = new RegExp(`\\b${escapedGame}\\b`, 'i'); // 'i' pour ignorer la casse si nécessaire
        const isSameGame = regex.test(scoreResult);
        
        const data = {
            username: username,
            result: goodResult,
            date: new Date().toISOString()
        };

        try {
            if (!isSameGame) throw new Error("Wrong Combination Game / Score");
            
            const gameRef = ref(database, `games/${game}/scores`);
            await push(gameRef, data);
            alert("Data successfully saved!");
            document.getElementById("username").value = "";
            document.getElementById("scoreResult").value = "";

            displayScores("", game);
        } catch (error) {
            alert("Error adding document:", error);
        }
    });

// Afficher les valeurs de la base de données
document.getElementById("databaseList").addEventListener("change", async function () {
    
    const selectedDatabase = this.value.toUpperCase();
    const podiumDiv = document.getElementById("podium");
    const listDiv = document.getElementById("scoreList");
    podiumDiv.innerHTML = "";
    listDiv.innerHTML = "";

    if (selectedDatabase) {
        
        const scoresRef = ref(database, `games/${selectedDatabase}/scores`);
        const gameNumberSelect = document.getElementById("gameNumberSelect");
        let scores = [];

        onValue(scoresRef, (snapshot) => {
            podiumDiv.innerHTML = "";
            listDiv.innerHTML = "";
            gameNumberSelect.innerHTML = "<option value=''>Select a day</option>";

            scores = []; // Réinitialiser les scores
            let gameNumbers = []; // Utilisation d'un tableau plutôt que d'un Set pour conserver l'ordre des jours

            snapshot.forEach((childSnapshot) => {
                const record = childSnapshot.val();
                
                // Extraire le score avec une vérification de `match`
                let strScore = `0/${record.result.split("/")[1]}`; // Valeur par défaut en cas de format inattendu
                const scoreMatch = record.result.match(/(\d+)\/(\d+)/);
                
                if (scoreMatch) {
                    strScore = scoreMatch[0];
                } else {
                    console.warn("Format inattendu pour le score:", record.result);
                }
            
                try {
                    const [numerator, denominator] = strScore.split("/").map(Number);
            
                    // Si le score est 0, on le met à `denominator + 1` pour l'incrémenter
                    if (numerator === 0) {
                        strScore = `${denominator + 1}/${denominator}`;
                    }
                } catch (error) {
                    console.log("Erreur lors de la manipulation du score:", error);
                }
                // Extraction et formatage du numéro de jeu
                let gameNumber;
                if (record.result.match(/^#SEARCHLE/)) gameNumber = record.result.split(" ")[1];
                else gameNumber = (record.result.match(/#\d+/) || ["#0"])[0];
                
                scores.push({
                    username: record.username,
                    score: strScore,
                    date: gameNumber
                });
            
                gameNumbers.push(gameNumber);
            });
            

            // Trier les jours de manière décroissante (le plus récent d'abord)
            gameNumbers = Array.from(new Set(gameNumbers)); // Enlever les doublons
            gameNumbers.sort((a, b) => b.localeCompare(a)); // Tri décroissant (le plus récent en premier)

            // Ajouter les jours au selecteur
            gameNumbers.forEach(number => {
                const option = document.createElement("option");
                option.value = number;
                if (!number.match(/^#/)) number = "#"+number;
                option.textContent = `${number}`;
                gameNumberSelect.appendChild(option);
            });

            // Sélectionner le jour le plus récent par défaut
            if (gameNumbers.length > 0) {
                gameNumberSelect.value = gameNumbers[0]; // Sélectionne le plus récent
            }

            // Trier les scores selon l'ordre défini dans le JSON
            displayScores(scores, selectedDatabase); // Passer aussi le jeu sélectionné
        });
       

        // Écouteur de changement de sélection pour recalculer le podium
        gameNumberSelect.addEventListener("change", () => {
            const selectedGameNumber = gameNumberSelect.value;

            // Si l'utilisateur a sélectionné "Select a day" (valeur vide), ne rien faire
            if (selectedGameNumber === "") {
                return; // Aucune action ne sera entreprise
            }

            displayScores(scores, selectedDatabase); // Affiche les scores pour le jour sélectionné
        });

    }
});

});

function displayScores(scores = "", selectedDatabase) {
    // Si `scores` ou `selectedDatabase` est vide, déclenche l'événement `change`
    if (scores === "") {
        const databaseList = document.getElementById("databaseList");
        if (selectedDatabase) {
            databaseList.value = selectedDatabase; // Sélectionne la base de données
        }
        
        const event = new Event('change');
        let test = databaseList.dispatchEvent(event); // Déclenche l'événement `change`
        
        return; // Arrête l'exécution pour éviter d'afficher des scores vides
    }
    
    // Logique d'affichage des scores si `scores` et `selectedDatabase` sont valides
    const selectedGameNumber = document.getElementById("gameNumberSelect").value;

    // Filtrer et trier les scores
    const filteredScores = selectedGameNumber
        ? scores.filter(record => record.date === selectedGameNumber)
        : scores;

    // Tri et affichage des scores
    const podiumDiv = document.getElementById("podium");
    const listDiv = document.getElementById("scoreList");
    podiumDiv.innerHTML = "";
    listDiv.innerHTML = "";

    filteredScores.forEach((record, index) => {
        const recordDiv = document.createElement("div");
        recordDiv.classList.add("record");
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

// Fonction pour récupérer les jeux
async function getGame() {
    const json = await getJson();
    
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
        optionDb.value = site.name.toUpperCase();
        optionDb.textContent = site.name;
        dbListe.appendChild(optionDb);
    });
}

async function getJson(){
    const url = "./site.json";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const json = await response.json();
        return json;
    }
    catch (error) {
        console.error(error.message);
    }
}
