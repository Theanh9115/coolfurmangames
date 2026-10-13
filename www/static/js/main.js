console.log("main.js loaded - edit me in www/static/js/main.js");

/* I have received help in putting this code together from geeksforgeeks and stackoverflow */

/* Got elements from all relevant parts that should be effected by darkmode toggle */
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;
const bodyElems = document.body.getElementsByTagName("*");

/* toggle from user pressing the button, makes all elements inherent "dark" classname */
body.classList.add("light");
themeToggle.addEventListener("click" , () => { 
    if (body.classList.contains("light")){
        darkMode();}
    else{
        lightMode()}
})

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
}