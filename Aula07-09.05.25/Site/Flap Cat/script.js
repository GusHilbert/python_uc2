const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const catImg = new Image();
catImg.src = "gatoMuitoForte1.png"; // imagem do gato

let cat;
let pipes;
let frame;

// Reinicia o jogo
function resetGame() {
  cat = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.5,
    lift: -8,
    velocity: 0
  };

  pipes = [];
  frame = 0;
}

// Desenha o gato
function drawCat() {
  ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
}

// Desenha os canos
function drawPipes() {
  pipes.forEach(pipe => {
    // Cor do "prédio"
    ctx.fillStyle = "#444"; // cinza escuro

    // Parte de cima (prédio de cima)
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);

    // Parte de baixo (prédio de baixo)
    ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);

    // Janela padrão
    ctx.fillStyle = "#ccc";
    let windowSize = 6;
    let windowSpacingX = 12;
    let windowSpacingY = 12;

    // Janelas do prédio de cima
    for (let y = 5; y < pipe.top - windowSize; y += windowSpacingY) {
      for (let x = 5; x < pipe.width - 10; x += windowSpacingX) {
        ctx.fillRect(pipe.x + x, y, windowSize, windowSize);
      }
    }

    // Janelas do prédio de baixo
    for (let y = pipe.top + pipe.gap + 5; y < canvas.height - windowSize; y += windowSpacingY) {
      for (let x = 5; x < pipe.width - 10; x += windowSpacingX) {
        ctx.fillRect(pipe.x + x, y, windowSize, windowSize);
      }
    }
  });
}


// Atualiza os canos
function updatePipes() {
  if (frame % 100 === 0) {
    const top = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      gap: 150
    });
  }

  pipes.forEach(pipe => pipe.x -= 2);
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Verifica colisão
function checkCollision() {
  for (let pipe of pipes) {
    let hitX = cat.x < pipe.x + pipe.width && cat.x + cat.width > pipe.x;
    let hitY = cat.y < pipe.top || cat.y + cat.height > pipe.top + pipe.gap;
    if (hitX && hitY) return true;
  }

  if (cat.y + cat.height >= canvas.height || cat.y < 0) return true;

  return false;
}

// Atualiza o gato
function updateCat() {
  cat.velocity += cat.gravity;
  cat.y += cat.velocity;
}

// Desenha tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCat();
  drawPipes();
}

// Loop do jogo
function update() {
  frame++;
  updateCat();
  updatePipes();

  if (checkCollision()) {
    resetGame(); // reinicia
  }

  draw();
  requestAnimationFrame(update);
}

// Faz o gato "pular"
document.addEventListener("keydown", () => {
  cat.velocity = cat.lift;
});

// Começa o jogo
catImg.onload = function () {
  resetGame();
  update();
};
