kaboom({
    global: true,  // Define que as variáveis e funções serão globais
    canvas: document.querySelector("#game"),  // Define o canvas onde o jogo será renderizado
    background: [white],  // Cor do fundo do jogo (RGB)
    width: window.innerWidth,  // Largura da tela igual à largura da janela do navegador
    height: window.innerHeight,  // Altura da tela igual à altura da janela do navegador
    scale: 1,  // Escala da tela (não há escalamento)
});