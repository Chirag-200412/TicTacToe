let board, currentPlayer, mode, gameActive;

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  initBoard();
}

function initBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  gameActive = true;
  document.getElementById("status").innerText =
    mode === "pc" ? "Player (X) vs Computer (O)" : "Player 1 (X)'s turn";

  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleMove);
      boardDiv.appendChild(cell);
    }
  }
}

function handleMove(e) {
  if (!gameActive) return;
  const row = e.target.dataset.row;
  const col = e.target.dataset.col;
  if (board[row][col] !== "") return;

  board[row][col] = currentPlayer;
  e.target.innerText = currentPlayer;
  e.target.classList.add("disabled");

  if (checkWinner(currentPlayer)) {
    highlightWinner(currentPlayer);
    return;
  }

  if (isFull()) {
    document.getElementById("status").innerText = "Tie Game!";
    gameActive = false;
    return;
  }

  if (mode === "player") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").innerText = `${currentPlayer}'s turn`;
  } else {
    if (currentPlayer === "X") {
      currentPlayer = "O";
      document.getElementById("status").innerText = "Computer's turn...";
      setTimeout(computerMove, 500);
    } else {
      currentPlayer = "X";
      document.getElementById("status").innerText = "Player's turn";
    }
  }
}

function computerMove() {
  if (!gameActive) return;
  const move = bestMove();
  if (move) {
    const [row, col] = move;
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    board[row][col] = "O";
    cell.innerText = "O";
    cell.classList.add("disabled");
    if (checkWinner("O")) {
      highlightWinner("O");
      return;
    }
    if (isFull()) {
      document.getElementById("status").innerText = "Tie Game!";
      gameActive = false;
      return;
    }
    currentPlayer = "X";
    document.getElementById("status").innerText = "Player's turn";
  }
}

function bestMove() {
  let moves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") moves.push([i, j]);
    }
  }
  if (moves.length === 0) return null;

  for (let player of ["O", "X"]) {
    for (let [r, c] of moves) {
      let copy = JSON.parse(JSON.stringify(board));
      copy[r][c] = player;
      if (checkWinner(player, copy)) return [r, c];
    }
  }
  let corners = moves.filter(
    (m) =>
      (m[0] === 0 && m[1] === 0) ||
      (m[0] === 0 && m[1] === 2) ||
      (m[0] === 2 && m[1] === 0) ||
      (m[0] === 2 && m[1] === 2)
  );
  if (corners.length > 0)
    return corners[Math.floor(Math.random() * corners.length)];
  let edges = moves.filter(
    (m) =>
      (m[0] === 0 && m[1] === 1) ||
      (m[0] === 1 && m[1] === 0) ||
      (m[0] === 1 && m[1] === 2) ||
      (m[0] === 2 && m[1] === 1)
  );
  if (edges.length > 0) return edges[Math.floor(Math.random() * edges.length)];
  return moves[Math.floor(Math.random() * moves.length)];
}

function checkWinner(player, customBoard = board) {
  for (let i = 0; i < 3; i++) {
    if (
      customBoard[i][0] === player &&
      customBoard[i][1] === player &&
      customBoard[i][2] === player
    )
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    if (
      customBoard[0][i] === player &&
      customBoard[1][i] === player &&
      customBoard[2][i] === player
    )
      return [
        [0, i],
        [1, i],
        [2, i],
      ];
  }
  if (
    customBoard[0][0] === player &&
    customBoard[1][1] === player &&
    customBoard[2][2] === player
  )
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  if (
    customBoard[0][2] === player &&
    customBoard[1][1] === player &&
    customBoard[2][0] === player
  )
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  return false;
}

function highlightWinner(player) {
  let winCells = checkWinner(player);
  if (winCells) {
    winCells.forEach(([r, c]) => {
      document
        .querySelector(`[data-row="${r}"][data-col="${c}"]`)
        .classList.add("win");
    });
    document.getElementById("status").innerText =
      mode === "pc" && player === "O" ? "Computer Wins!" : `${player} Wins!`;
    gameActive = false;
  }
}

function isFull() {
  return board.flat().every((cell) => cell !== "");
}

function restartGame() {
  initBoard();
}

function backToMenu() {
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

function exitGame() {
  alert("Thanks for playing!");
  window.open("", "_self");
  window.close();
}
