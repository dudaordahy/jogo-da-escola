// Seleciona o canvas da página com id "game"
const canvas = document.querySelector("#game");

// Obtém o contexto 2D para desenhar no canvas
const ctx = canvas.getContext("2d");

const finalizacao = document.getElementById("finalizacao")

// Define a largura e altura do canvas como o tamanho da janela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Objeto para armazenar sprites carregados
const sprites = {};

// Função para carregar sprites
function loadSprite(name, url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        sprites[name] = img;
    };
    img.onerror = () => {
        console.error(`Erro ao carregar sprite: ${url}`);
    };
}

loadSprite("menina", "https://i.imgur.com/CU9daOM.png");
loadSprite("menina_direita", "https://i.imgur.com/AFmLwR3.png");
loadSprite("menina_esquerda", "https://i.imgur.com/yDmWxEF.png");
loadSprite("lixo", "https://i.imgur.com/TSS6fRx.png");

// Variável que armazena os pontos do jogador
let pontos = 0;

let formattedTime = "00:00:00"

// Variável que indica se o jogador pode clicar no item
let podeClicar = false;

// Objeto que representa o jogador
const player = {
    sprite:"menina",
    x: 100,                                // Posição inicial no eixo X
    y: canvas.height - 100,                // Posição inicial no eixo Y (perto do chão)
    width: 100,                             // Largura do jogador
    height: 80,                            // Altura do jogador
    speed: 8,                              // Velocidade de movimento
    vy: 0,                                 // Velocidade vertical (para o pulo)
    gravity: 0.5,                          // Gravidade que afeta o pulo
    onGround: false,                       // Indica se está no chão
}

// Objeto que representa o chão
const ground = {
    x: 0,                                  // Posição X (início da tela)
    y: canvas.height - 50,                 // Posição Y (em baixo da tela)
    width: canvas.width,                   // Largura igual à da tela
    height: 50,                            // Altura do chão
    color: "#505050"                       // Cor azul clara
};

// Objeto que representa o item clicável
const item = {
    sprite: "lixo",
    x: Math.random() * (canvas.width - 32), // Posição X aleatória
    y: canvas.height - 90,                  // Posição Y aleatória
    width: 50,                              // Largura do item
    height: 60,                             // Altura do item
    color: "gold",                          // Cor dourada
    visible: true                           // Se o item está visível
};

// Função para desenhar um objeto (sprite ou retângulo)
function drawObject(obj) {
    if (obj.sprite && sprites[obj.sprite]) {
        ctx.drawImage(sprites[obj.sprite], obj.x, obj.y, obj.width, obj.height);
    } else {
        ctx.fillStyle = obj.color || "black";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}
// Função que desenha a pontuação na tela
function drawScore() { 
    ctx.fillStyle = "black";                // Cor do texto
    ctx.font = "20px American Captain";           // Fonte do texto
    ctx.fillText("Lixo🗑️: " + pontos, 1090, 35); // Escreve o texto na tela
}

function drawTimer() {
    ctx.fillStyle = "black";                // Cor do texto
    ctx.font = "20px American Captain";           // Fonte do texto
    ctx.fillText(formattedTime, 1190, 35);
}

// Atualiza a posição e estado do jogador
function updatePlayer() {
    player.vy += player.gravity;            // Aplica a gravidade
    player.y += player.vy;                  // Atualiza a posição vertical

    // Verifica se o jogador colidiu com o chão
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height; // Corrige posição para "ficar em cima"
        player.vy = 0;                       // Zera a velocidade vertical
        player.onGround = true;              // Está no chão
    } else {
        player.onGround = false;             // Está no ar
    }
}

// Verifica colisão entre dois objetos retangulares
function checkCollision(a, b) {
    return a.x < b.x + b.width &&           // Checa sobreposição no eixo X
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&          // Checa sobreposição no eixo Y
           a.y + a.height > b.y;
}

// Trata o clique no item
function handleItemClick(e) {
    const rect = canvas.getBoundingClientRect(); // Obtém posição do canvas na tela
    const clickX = e.clientX - rect.left;        // Posição X do clique no canvas
    const clickY = e.clientY - rect.top;         // Posição Y do clique no canvas

    // Verifica se pode clicar e se o clique foi dentro do item
    if (podeClicar && item.visible &&
        clickX >= item.x && clickX <= item.x + item.width &&
        clickY >= item.y && clickY <= item.y + item.height) {

        pontos++;                                // Incrementa pontuação
        // Reposiciona o item em uma nova posição aleatória
        item.x = Math.random() * (canvas.width - 32);
        item.y = canvas.height - 90;
        podeClicar = false;                      // Desativa clique até nova colisão
    }
}

// Adiciona controle por teclado
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") {
        player.sprite = "menina_direita";
        player.x += player.speed
    }   // Move para a direita
    if (e.key === "ArrowLeft") {
        player.sprite = "menina_esquerda";
        player.x -= player.speed
    }   // Move para a esquerda
    if ((e.key === "ArrowUp" || e.key === " ") && player.onGround) {
        player.sprite = "menina";
        player.vy = -12;                            // Pula (se estiver no chão)
    }
    if (e.key === "d") {
        player.sprite = "menina_direita";
        player.x += player.speed
    }   // Move para a direita
    if (e.key === "a"){
        player.sprite = "menina_esquerda";
        player.x -= player.speed
    }   // Move para a esquerda
    if ((e.key === "w") && player.onGround) {
        player.sprite = "menina";
        player.vy = -12;                            // Pula (se estiver no chão)
    }
});

// Inicia o loop do jogo

let startTime;

function startTimer() {
  startTime = Date.now();
  updateTimer();
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

  formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  if(minutes >= 2) {
    finalizacao.style.display = "block";
    formattedTime = "00:00:00"
    clearTimeout();
    window.addEventListener("keydown", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
      }, true)
    }

  setTimeout(updateTimer, 1000); // Update every second
}

function pad(number) {
  return number < 10 ? '0' + number : number;
}

// Adiciona evento de clique do mouse no canvas
canvas.addEventListener("click", handleItemClick);

// Função principal que atualiza o jogo a cada frame
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

    updatePlayer();                                   // Atualiza física do jogador

    // Verifica se jogador está colidindo com item
    if (checkCollision(player, item)) {
        podeClicar = true;                            // Ativa clique no item
    } else {
        podeClicar = false;                           // Desativa se não estiver tocando
    }  
    
    drawObject(ground);
    drawObject(player);
    if (item.visible) drawObject(item);                // Desenha o item se visível

    drawScore();                                      // Mostra a pontuação
    drawTimer();
    requestAnimationFrame(loop);    
    
// Chama o próximo frame
}

function reiniciarJogo(){
    window.location.href = "moscou.html"
}
function voltarPagina(){
    window.location.href = "pagina_inicial.html"
}
startTimer();

loop();