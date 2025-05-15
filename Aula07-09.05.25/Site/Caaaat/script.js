const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurações do jogo
const TAMANHO_BLOCO = 20;
const LARGURA = canvas.width;
const ALTURA = canvas.height;

let velocidadeX = TAMANHO_BLOCO;
let velocidadeY = 0;
let gato = [{ x: LARGURA / 2, y: ALTURA / 2 }];
let comprimento = 1;

// Posição inicial do haltere
let haltere = {
  x: Math.floor(Math.random() * (LARGURA / TAMANHO_BLOCO)) * TAMANHO_BLOCO,
  y: Math.floor(Math.random() * (ALTURA / TAMANHO_BLOCO)) * TAMANHO_BLOCO,
};

// Pontuação
let pontuacao = 0;

// Imagens do gato
const imagensGato = [
  { src: "Imagem/gatoFraco.jpeg", tamanho: 20 }, // Normal
  { src: "Imagem/gatoForte.jpeg", tamanho: 30 }, // Forte
  { src: "Imagem/gatoMuitoForte.jpeg", tamanho: 40 }, // Muito Forte
];
let estadoAtual = 0; // 0 = Normal, 1 = Forte, 2 = Muito Forte
let tamanhoAtual = imagensGato[estadoAtual].tamanho;

// Carregar imagens
const imgGato = new Image();
imgGato.src = imagensGato[estadoAtual].src;

// Controle de movimento
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && velocidadeY === 0) {
    velocidadeX = 0;
    velocidadeY = -TAMANHO_BLOCO;
  } else if (e.key === "ArrowDown" && velocidadeY === 0) {
    velocidadeX = 0;
    velocidadeY = TAMANHO_BLOCO;
  } else if (e.key === "ArrowLeft" && velocidadeX === 0) {
    velocidadeX = -TAMANHO_BLOCO;
    velocidadeY = 0;
  } else if (e.key === "ArrowRight" && velocidadeX === 0) {
    velocidadeX = TAMANHO_BLOCO;
    velocidadeY = 0;
  }
});

// Função para atualizar o jogo
function atualizarJogo() {
  const cabeca = { x: gato[0].x + velocidadeX, y: gato[0].y + velocidadeY };

  // Teletransporte nas bordas
  if (cabeca.x >= LARGURA) cabeca.x = 0;
  if (cabeca.x < 0) cabeca.x = LARGURA - TAMANHO_BLOCO;
  if (cabeca.y >= ALTURA) cabeca.y = 0;
  if (cabeca.y < 0) cabeca.y = ALTURA - TAMANHO_BLOCO;

  // Verifica se pegou o haltere
  if (cabeca.x === haltere.x && cabeca.y === haltere.y) {
    comprimento++;
    pontuacao++;
    document.getElementById("score").textContent = `Pontuação: ${pontuacao}`;
    haltere.x = Math.floor(Math.random() * (LARGURA / TAMANHO_BLOCO)) * TAMANHO_BLOCO;
    haltere.y = Math.floor(Math.random() * (ALTURA / TAMANHO_BLOCO)) * TAMANHO_BLOCO;

    // Verifica mudança de etapa
    if (pontuacao % 20 === 0 && estadoAtual < imagensGato.length - 1) {
      estadoAtual++;
      tamanhoAtual = imagensGato[estadoAtual].tamanho;
      imgGato.src = imagensGato[estadoAtual].src;
    }
  }

  // Atualiza o corpo do gato
  gato.unshift(cabeca);
  if (gato.length > comprimento) gato.pop();

  // Redesenha o jogo
  desenharJogo();

  // Continua o loop
  setTimeout(atualizarJogo, 100);
}

// Função para desenhar o jogo
function desenharJogo() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  // Desenha o gato
  gato.forEach((parte, index) => {
    const tamanho = index === 0 ? tamanhoAtual : TAMANHO_BLOCO;
    ctx.drawImage(imgGato, parte.x, parte.y, tamanho, tamanho);
  });

  // Desenha o haltere
  ctx.fillStyle = "green";
  ctx.fillRect(haltere.x, haltere.y, TAMANHO_BLOCO, TAMANHO_BLOCO);
}

// Inicia o jogo
imgGato.onload = () => atualizarJogo();
