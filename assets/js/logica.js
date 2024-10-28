document.addEventListener("DOMContentLoaded", () => {
  const containerGame = document.getElementById("container-game");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const levelSelector = document.getElementById("Nivel");
  const modeSelector = document.getElementById("mode");
  const roundDisplay = document.getElementById("current-player");
  const messageContainer = document.getElementById("message-container");

  const symbols = ["X", "O"];
  let currentPlayer = 0;
  let board = [];
  let gameActive = true;
  let boardSize = 3;
  let gameMode = "friend";
  let winningSequence = 3; // Padrão 3 para 3x3

  const createBoard = () => {
    containerGame.innerHTML = "";
    containerGame.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(""));

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
    messageContainer.innerHTML = "";
  };

  const handleCellClick = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (board[row][col] !== "" || !gameActive || (currentPlayer === 0 && gameMode === "machine")) {
      return;
    }

    playMove(row, col);
  };

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

  const updateCurrentPlayerDisplay = () => {
    roundDisplay.innerText = `É a vez do jogador: ${symbols[currentPlayer]}`;
  };

  const playMove = (row, col) => {
    board[row][col] = symbols[currentPlayer];
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.innerText = symbols[currentPlayer];
    cell.classList.add(currentPlayer === 0 ? "x-symbol" : "o-symbol");

    updateCurrentPlayerDisplay();

    if (checkWinner()) {
      messageContainer.innerHTML = `<div class="mensagem swashIn"><span>${symbols[currentPlayer]} venceu!</span></div>`;
      gameActive = false;
      return;
    }

    if (isDraw()) {
      messageContainer.innerHTML = `<div class="mensagem"><span>Empate!</span></div>`;
      gameActive = false;
      return;
    }

    currentPlayer = (currentPlayer + 1) % 2;
    if (currentPlayer === 0 && gameMode === "machine" && gameActive) {
      setTimeout(aiPlay, 500);
    }
  };

  const checkWinner = () => {
    const checkLine = (cells) => cells.every((cell) => cell === symbols[currentPlayer]);

    const directions = [
      { x: 1, y: 0 }, // Horizontal
      { x: 0, y: 1 }, // Vertical
      { x: 1, y: 1 }, // Diagonal principal
      { x: 1, y: -1 }, // Diagonal secundária
    ];

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === symbols[currentPlayer]) {
          for (let { x, y } of directions) {
            const cells = [];
            for (let k = 0; k < winningSequence; k++) {
              const row = i + k * y;
              const col = j + k * x;
              if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
                cells.push(board[row][col]);
              }
            }
            if (cells.length === winningSequence && checkLine(cells)) return true;
          }
        }
      }
    }
    return false;
  };

  const isDraw = () => board.flat().every((cell) => cell !== "");

  const resetGame = () => {
    currentPlayer = 0;
    gameActive = true;
    createBoard();
  };

  const startGame = () => {
    const level = levelSelector.value;
    gameMode = modeSelector.value;

    switch (level) {
      case "easy":
        boardSize = 3;
        winningSequence = 3;
        break;
      case "medium":
        boardSize = 6;
        winningSequence = 5;
        break;
      case "hard":
        boardSize = 9;
        winningSequence = 7;
        break;
    }

    resetGame();
    if (gameMode === "machine" && gameActive) {
      setTimeout(aiPlay, 500);
    }
  };

  updateCurrentPlayerDisplay();
  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", resetGame);
});
