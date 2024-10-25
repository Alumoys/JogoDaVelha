document.addEventListener("DOMContentLoaded", () => {
  const containerGame = document.getElementById("container-game");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const levelSelector = document.getElementById("Nivel");
  const modeSelector = document.getElementById("mode");
  const roundDisplay = document.getElementById('current-player');

  const symbols = ["X", "O"]; // Apenas dois jogadores
  let currentPlayer = 0; // Jogador atual
  let board = [];
  let gameActive = true;
  let boardSize = 3; // Tamanho padrão (3x3)
  let gameMode = "friend"; // Modo de jogo padrão (contra amigo)

  // Função para criar o tabuleiro da velha
  const createBoard = () => {
    containerGame.innerHTML = ""; // Limpa o tabuleiro
    containerGame.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`; // Define o tamanho das colunas do grid
    board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill("")); // Cria o array do tabuleiro

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener("click", handleCellClick);
        containerGame.appendChild(cell);
      }
    }
  };

  // Função para lidar com o clique em uma célula
  const handleCellClick = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (
      board[row][col] !== "" ||
      !gameActive ||
      (currentPlayer === 0 && gameMode === "machine")
    ) {
      return; // Impede que a célula já preenchida seja clicada
    }

    playMove(row, col);
  };

  // Função para a IA (modo máquina)
  const aiPlay = () => {
    let emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === "") {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      playMove(row, col);
    }
  };

  // Função para atualizar a exibição do jogador atual
const updateCurrentPlayerDisplay = () => {
    roundDisplay.innerText = `É a vez do jogador: ${symbols[currentPlayer]}`; // Atualiza o texto
  };

  // Função para realizar a jogada
  const playMove = (row, col) => {
    board[row][col] = symbols[currentPlayer]; // Marca a célula com o símbolo do jogador atual
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );

    // Adiciona o símbolo com a cor correspondente
    cell.innerText = symbols[currentPlayer];
    if (currentPlayer === 0) {
      cell.classList.add("x-symbol"); // Adiciona classe para o 'X'
    } else {
      cell.classList.add("o-symbol"); // Adiciona classe para o 'O'
    }

    cell.classList.add("played"); // Adiciona uma classe para animação (se desejar)

    updateCurrentPlayerDisplay();

    if (checkWinner()) {
        // Obtenha a referência do elemento onde você quer mostrar a mensagem
        const messageContainer = document.getElementById('message-container'); // Altere para o ID real do seu container
    
        // Defina o innerHTML para mostrar a mensagem de vitória
        messageContainer.innerHTML = `<div class="mensagem">
            <span>${symbols[currentPlayer]} venceu!</span>
        </div>`;
        
        gameActive = false; // Para desativar o jogo
        return;
    }
    

    if (isDraw()) {
      alert("Empate!");
      gameActive = false;
      return;
    }

    // Troca de jogador
    currentPlayer = (currentPlayer + 1) % 2;

    // Se for a vez da IA e o modo for "machine"
    if (currentPlayer === 0 && gameMode === "machine" && gameActive) {
      setTimeout(aiPlay, 500); // IA joga com um pequeno delay
    }
  };
  

  // Função para verificar se há um vencedor
  const checkWinner = () => {
    for (let i = 0; i < boardSize; i++) {
      if (board[i].every((cell) => cell === symbols[currentPlayer])) {
        return true; // Verifica as linhas
      }
      if (board.every((row) => row[i] === symbols[currentPlayer])) {
        return true; // Verifica as colunas
      }
    }

    // Verifica diagonais
    if (board.every((row, idx) => row[idx] === symbols[currentPlayer])) {
      return true;
    }
    if (
      board.every(
        (row, idx) => row[boardSize - idx - 1] === symbols[currentPlayer]
      )
    ) {
      return true;
    }

    return false;
  };

  // Função para verificar empate
  const isDraw = () => {
    return board.flat().every((cell) => cell !== "");
  };

  // Função para resetar o jogo
  const resetGame = () => {
    currentPlayer = 0;
    gameActive = true;
    createBoard();
  };

  // Função para iniciar o jogo
  const startGame = () => {
    const level = levelSelector.value;
    gameMode = modeSelector.value;

    switch (level) {
      case "easy":
        boardSize = 3;
        break;
      case "medium":
        boardSize = 7;
        break;
      case "hard":
        boardSize = 10;
        break;
    }

    resetGame();

    // Se for o modo máquina e a IA for o primeiro a jogar
    if (gameMode === "machine" && gameActive) {
      setTimeout(aiPlay, 500); // IA joga com um pequeno delay
    }
  };
  updateCurrentPlayerDisplay();
  // Event listeners para os botões
  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", resetGame);
});
