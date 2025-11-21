const canvas = document.getElementById("quadro");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "https://lotunos.github.io/Portifolio/Biblioteca.png";

img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};


