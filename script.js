kaboom({
    global: true,  // Define que as variáveis e funções serão globais
    canvas: document.querySelector("#game"),  // Define o canvas onde o jogo será renderizado
    background: [333, 333, 333],  // Cor do fundo do jogo (RGB)
    width: window.innerWidth,  // Largura da tela igual à largura da janela do navegador
    height: window.innerHeight,  // Altura da tela igual à altura da janela do navegador
    scale: 1,  // Escala da tela (não há escalamento)
});

loadSprite("princesa_ana", "https://i.imgur.com/vSQku0M.jpg");  // URL do sprite do personagem
loadSprite("item", " ");

let pontos = 0;

const score = add([
    text("Pontos: 0"),
    pos(10, 10),
    layer("ui"),
]);

const player = add([
        sprite("princesa_ana"),  // Carrega o sprite do personagem
        pos(100, height() - 100),  // Posição inicial do personagem: 100px da borda esquerda e 100px acima do chão
        area(),  // Habilita a área de colisão para o personagem
        body(),  // Habilita a física (gravidade, colisão)
        scale(1),  // Define o tamanho do personagem (escala de 1)
]);

const ground = add([
    rect(width(), 48),  // Cria um retângulo com a largura da tela e altura de 48px (o chão)
    pos(0, height() - 48),  // Posiciona o chão na parte inferior da tela
    outline(4),  // Adiciona uma borda ao redor do chão
    area(),  // Habilita a área de colisão para o chão
    body({ isStatic: true }),  // Define o chão como estático (não se move)
    color(95, 205, 228),  // Cor do chão (RGB)
]);

setGravity(1200);

const speed = 200;  // O personagem vai se mover a 200 pixels por segundo

const leftLimit = 0;  // Limite esquerdo (bordo da tela, ou seja, 0 pixels)
const rightLimit = width() - player.width;  // Limite direito (largura da tela - largura do personagem)
const topLimit = 0;  // Limite superior (parte superior da tela)
const bottomLimit = height() - ground.height - player.height;  // Limite inferior (parte inferior da tela considerando o chão)

onKeyDown("right", () => {
    if (player.pos.x + player.width < rightLimit) {
        player.move(speed, 0);  // Move o personagem para a direita
    }
});

// Controle de movimento para a esquerda
onKeyDown("left", () => {
    if (player.pos.x > leftLimit) {
        player.move(-speed, 0);  // Move o personagem para a esquerda
    }
});

// Controle de movimento para baixo
onKeyDown("down", () => {
    if (player.pos.y + player.height < bottomLimit) {
        player.move(0, speed);  // Move o personagem para baixo
    }
});

// Controle de movimento para cima
onKeyDown("up", () => {
    if (player.isGrounded()) {
        player.jump(600);
    }
});

onKeyPress("space", () => {
    if (player.isGrounded()) {
        player.jump(600);
    }
});

let item;
let podeClicar = false; // Flag de controle

// Cria um item e define evento de clique
function criarItem() {
    item = add([
        sprite("item"),
        pos(rand(0, width() - 32), rand(0, height() - 32)),
        area(),
        "item",
    ]);

    item.onClick(() => {
        if (podeClicar) {
            pontos++;
            score.text = "Pontos: " + pontos;
            destroy(item);
            podeClicar = false;
            criarItem(); // Novo item
        }
    });
}

// Detecta início da colisão
player.onCollide("item", () => {
    podeClicar = true;
});

// Detecta fim da colisão
player.onCollideEnd("item", () => {
    podeClicar = false;
});

criarItem();

