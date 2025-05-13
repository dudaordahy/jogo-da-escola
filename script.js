// Seleciona o canvas da página com id "game"
const canvas = document.querySelector("#game");

// Obtém o contexto 2D para desenhar no canvas
const ctx = canvas.getContext("2d");

// Define a largura e altura do canvas como o tamanho da janela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variável que armazena os pontos do jogador
let pontos = 0;

// Variável que indica se o jogador pode clicar no item
let podeClicar = false;

// Objeto que representa o jogador
const player = {
    x: 100,                                // Posição inicial no eixo X
    y: canvas.height - 100,                // Posição inicial no eixo Y (perto do chão)
    width: 64,                             // Largura do jogador
    height: 64,                            // Altura do jogador
    speed: 8,                              // Velocidade de movimento
    vy: 0,                                 // Velocidade vertical (para o pulo)
    gravity: 0.5,                          // Gravidade que afeta o pulo
    onGround: false,                       // Indica se está no chão
    color: "pink"                          // Cor do jogador
};

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
    x: Math.random() * (canvas.width - 32), // Posição X aleatória
    y: canvas.height - 80,                  // Posição Y aleatória
    width: 30,                              // Largura do item
    height: 30,                             // Altura do item
    color: "gold",                          // Cor dourada
    visible: true                           // Se o item está visível
};

// Função para desenhar um retângulo na tela (usada para jogador, chão, item)
function drawRect(obj) {
    ctx.fillStyle = obj.color;              // Define a cor de preenchimento
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height); // Desenha o retângulo
}

// Função que desenha a pontuação na tela
function drawScore() {
    ctx.fillStyle = "black";                // Cor do texto
    ctx.font = "20px sans-serif";           // Fonte do texto
    ctx.fillText("Pontos: " + pontos, 10, 30); // Escreve o texto na tela
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
        item.y = canvas.height - 80;
        podeClicar = false;                      // Desativa clique até nova colisão
    }
}

// Adiciona controle por teclado
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") player.x += player.speed;    // Move para a direita
    if (e.key === "ArrowLeft") player.x -= player.speed;     // Move para a esquerda
    if (e.key === "ArrowDown") player.y += player.speed;     // Move para baixo
    if ((e.key === "ArrowUp" || e.key === " ") && player.onGround) {
        player.vy = -12;                                      // Pula (se estiver no chão)
    }
});

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

    drawRect(ground);                                 // Desenha o chão
    drawRect(player);                                 // Desenha o jogador

    if (item.visible) drawRect(item);                 // Desenha o item se visível

    drawScore();                                      // Mostra a pontuação

    requestAnimationFrame(loop);                      // Chama o próximo frame
}

// Inicia o loop do jogo
loop();
