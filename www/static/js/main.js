console.log("main.js loaded - edit me in www/static/js/main.js");

/* I have received help in putting this code together from geeksforgeeks and stackoverflow */

/* Got elements from all relevant parts that should be effected by darkmode toggle */
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;
<<<<<<< HEAD
const navL = document.getElementsByClassName("nav-link");
const navB = document.getElementsByClassName("nav-bar")[0];
const gameB = document.querySelectorAll("game-button");
const gameS = document.getElementById("game-selection");
const game = document.getElementsByClassName("game");
const title = document.getElementById("nav-title");

/* toggle from user pressing the button, makes all elements inherent "dark" classname */
body.classList.add("light");
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.replace("light", "dark");
    title.classList.add("dark");
    navB.classList.add("dark");
    for (const nav of navL) {
      nav.classList.add("dark");
    }
    for (const g of game) {
      g.classList.add("dark");
    }
    for (const g of gameB) {
      g.classList.add("dark");
    }

    gameS.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.replace("dark", "light");
    title.classList.remove("dark");
    navB.classList.remove("dark");
    for (const nav of navL) {
      nav.classList.remove("dark");
    }
    for (const g of game) {
      g.classList.remove("dark");
    }
    for (const g of gameB) {
      g.classList.remove("dark");
    }

    gameS.classList.remove("dark");
  }
});
=======
const bodyElems = document.body.getElementsByTagName("*");

/* toggle from user pressing the button, makes all elements inherent "dark" classname */
body.classList.add("light");
themeToggle.addEventListener("click" , () => { 
    if (body.classList.contains("light")){
        darkMode();}
    else{
        lightMode()}
})
>>>>>>> 05fd488cf0003b28f0f03b53d0ae23cdeac149ac

function lightMode(){
    body.classList.replace("dark", "light");
    for (const el of bodyElems){
        el.classList.remove("dark");}
    localStorage.setItem("theme", "light");
}
function darkMode(){
    body.classList.replace("light", "dark");
    for (const el of bodyElems){
        el.classList.add("dark");}
    localStorage.setItem("theme", "dark");
}
const theme = localStorage.getItem("theme");

if (theme == "dark"){
    darkMode();
<<<<<<< HEAD
}

*/
=======
}
>>>>>>> 05fd488cf0003b28f0f03b53d0ae23cdeac149ac
