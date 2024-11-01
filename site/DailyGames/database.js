// Initialize Firebase (replace with your Firebase config)
import { firebaseConfig } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, push, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Initialize Firebase and Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.addEventListener("load", (event) => {
    getGame();

    //#region Create Database & Store Value
    document.getElementById("scoreForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent form from reloading the page

        const game = document.getElementById("game").value;
        const username = document.getElementById("username").value;
        const scoreResult = document.getElementById("scoreResult").value;

        // Prepare data to be stored
        const data = {
            username: username,
            result: scoreResult,
            date: new Date().toISOString()
        };

        try {
            // Save data to Realtime Database in the "scores" node for each game
            const gameRef = ref(database, `games/${game}/scores`);
            await push(gameRef, data);
            alert("Data successfully saved!");
        } catch (error) {
            console.error("Error adding document:", error);
        }
    });
    //#endregion

    //#region Show DB Value
    document.getElementById("databaseList").addEventListener("change", async function () {
        const selectedDatabase = this.value;
        const contentDiv = document.getElementById("databaseContent");
        contentDiv.innerHTML = ""; // Clear previous content

        if (selectedDatabase) {
            try {
                // Reference to the scores in the selected game's collection
                const scoresRef = ref(database, `games/${selectedDatabase}/scores`);
                
                // Listen for data changes
                onValue(scoresRef, (snapshot) => {
                    contentDiv.innerHTML = ""; // Clear previous content
                    snapshot.forEach((childSnapshot) => {
                        const record = childSnapshot.val();
                        const recordDiv = document.createElement("div");
                        recordDiv.classList.add("record");

                        // Display data similarly as before
                        let splittedResult = record.result.split('\n');
                        let pseudo = record.username;
                        let date = splittedResult[0];
                        let score = splittedResult[2];
                        let Rnd1 = splittedResult[4];
                        let Rnd2 = splittedResult[5];
                        let Rnd3 = splittedResult[6];
                        let Rnd4 = splittedResult[7];
                        let Rnd5 = splittedResult[8];

                        let strResult = `
                            <div class="record-details">
                                <span class="record-date">${date}</span>
                                <span class="record-pseudo">${pseudo}</span>
                                <span class="record-score">${score}</span>
                                <span class="record-rnd">${Rnd1}</span>
                                <span class="record-rnd">${Rnd2}</span>
                                <span class="record-rnd">${Rnd3}</span>
                                <span class="record-rnd">${Rnd4}</span>
                                <span class="record-rnd">${Rnd5}</span>
                            </div>
                        `;
                        recordDiv.innerHTML = strResult;
                        contentDiv.appendChild(recordDiv);
                    });
                }, (error) => {
                    console.error("Error retrieving records:", error);
                });
            } catch (error) {
                console.error("Error retrieving records:", error);
            }
        }
    });
    //#endregion
});

// Function to fetch games from site.json
async function getGame() {
    const url = "./site.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        const gameListe = document.getElementsByClassName('game')[0];
        const dbListe = document.getElementsByClassName('game')[1];

        // Sort and populate the options
        json.websites.sort((a, b) => a.name.localeCompare(b.name));

        json.websites.forEach(site => {
            // Create an 'option' element for the first list
            const optionGame = document.createElement('option');
            optionGame.value = site.name;
            optionGame.textContent = site.name;
            gameListe.appendChild(optionGame);

            // Create a new 'option' element for the second list
            const optionDb = document.createElement('option');
            optionDb.value = site.name;
            optionDb.textContent = site.name;
            dbListe.appendChild(optionDb);
        });
    } catch (error) {
        console.error(error.message);
    }
}
