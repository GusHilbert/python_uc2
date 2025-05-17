const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Imagem do jogador (gato maromba)
const playerImg = new Image();
playerImg.src = "gatoMuitoForte1.png"; // Troque pela sua imagem de gato maromba

// Imagem do halter
const weightImg = new Image();
weightImg.src = "halter1.png"; // Troque pelo sprite do halter

// Configurações do jogador
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  bullets: []
};

// Inimigos (halteres)
let enemies = [];
let frame = 0;

// Pontuação
let score = 0;

// Cria inimigo (halter)
function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2
  });
}

// Movimento do jogador
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Atirar
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    player.bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 5,
      height: 10,
      speed: 6
    });
  }
});

function update() {
  // Movimento do jogador
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  // Atualiza tiros
  player.bullets.forEach(bullet => bullet.y -= bullet.speed);
  player.bullets = player.bullets.filter(bullet => bullet.y > 0);

  // Atualiza inimigos
  if (frame % 60 === 0) createEnemy();
  enemies.forEach(enemy => enemy.y += enemy.speed);

  // Colisão tiro x inimigo
  enemies.forEach((enemy, ei) => {
    player.bullets.forEach((bullet, bi) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemies.splice(ei, 1);
        player.bullets.splice(bi, 1);
        score += 10; // Aumenta 10 pontos por inimigo destruído
      }
    });
  });

  enemies = enemies.filter(enemy => enemy.y < canvas.height);

  frame++;
}

// Desenha tudo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jogador
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Tiros
  ctx.fillStyle = "red";
  player.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Inimigos (halteres)
  enemies.forEach(enemy => {
    ctx.drawImage(weightImg, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Exibe a pontuação
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Pontuação: " + score, 10, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Inicia o jogo
playerImg.onload = () => {
  weightImg.onload = () => {
    gameLoop();
  };
};
