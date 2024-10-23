window.addEventListener("load", (event) => {
    let documentWidth = document.documentElement.clientWidth;
    let documentHeight = document.documentElement.clientHeight;
    console.log(documentHeight, documentWidth)
    let invButton = document.getElementById("invButton");
    let centerX = documentWidth / 2;
    let centerY = documentHeight / 2;
    invButton.style.top = centerY + 'px';
    invButton.style.left = centerX + 'px';
    invButton.style.width = "1100px";
    invButton.style.height = documentHeight + "px";

    invButton.addEventListener("click", () =>{
        let solvedEnigm = localStorage.getItem("nbEnigmSolved") == null ? parseInt(localStorage.setItem("nbEnigmSolved", 0)): parseInt(localStorage.getItem("nbEnigmSolved"));
        let video = document.getElementById("bgVideo");
        video.className = "zoom";
        setTimeout(() =>{
            window.location = window.location.href.split("index.html")[0] + "stage/lobby.html";
        }, 1000)
        console.log("inv button clicked")
    });
  });