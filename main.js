import Scene from "./src/hontedHouse"; 
import "./style.css";

window.addEventListener("DOMContentLoaded", ()=>{
    const canvas = document.getElementById('app');
    new Scene({canvas});
})