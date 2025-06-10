import { getData, postData } from "./dataHandler.js";

let game = { "turn": "not loaded", "winner": null };

const updateUI = () => {
  document.getElementById(0).innerHTML = game.board[0][0];
  document.getElementById(1).innerHTML = game.board[0][1];
  document.getElementById(2).innerHTML = game.board[0][2];
  document.getElementById(3).innerHTML = game.board[1][0];
  document.getElementById(4).innerHTML = game.board[1][1];
  document.getElementById(5).innerHTML = game.board[1][2];
  document.getElementById(6).innerHTML = game.board[2][0];
  document.getElementById(7).innerHTML = game.board[2][1];
  document.getElementById(8).innerHTML = game.board[2][2];

  switch (game.winner) {
    case "Computer":
      document.getElementById("beurt").innerHTML = "The Winner is " + game.winner;
      break;
    case "Player":
      document.getElementById("beurt").innerHTML = "The Winner is " + game.winner;
      break;
    case "draw":
      document.getElementById("beurt").innerHTML = "It's a draw!";
      break;
    default:
      document.getElementById("beurt").innerHTML = game.turn + "'s turn";
      break;
  }
}

const playerTurn = async (row, col) => {
  if (game.winner === null) {
    game.turn = "Computer";
    game.board[row][col] = "X";
    game.winner = checkForWin();
    await postData(game);
    updateUI();
  }
}

const computerTurn = async () => {
  if (game.winner === null) {
    while (game.turn === "Computer") {
      let row = Math.floor(Math.random() * 3);
      let col = Math.floor(Math.random() * 3);
      if (game.board[row][col] === "") {
        game.turn = "Player";
        game.board[row][col] = "O";
        game.winner = checkForWin();
        await postData(game);
      }
    }
    updateUI();
  }
}

const checkForWin = () => {
  let winner = null;

  // Check for horizontal win
  game.board.forEach(row => {
    if (row[0] == row[1] && row[0] == row[2] && row[0] != "") { winner = row[0]; } 
  });

  // Check for vertical win
  for (let col = 0; col < 3; col++) {
    if (game.board[0][col] == game.board[1][col] && game.board[0][col] == game.board[2][col] && game.board[0][col] != "") {
      winner = game.board[0][col];
    }
  }

  // Check for diagonal win
  if (game.board[0][0] == game.board[1][1] && game.board[0][0] == game.board[2][2] && game.board[0][0] != "") {
    winner = game.board[0][0];
  } else if (game.board[0][2] == game.board[1][1] && game.board[0][2] == game.board[2][0] && game.board[0][2] != "") {
    winner = game.board[0][2];
  }

  // Check for draw
  let noSpace = true;
  game.board.forEach(row => { row.forEach(cell => { if (cell === "") { noSpace = false; } }) })
  if (noSpace === true && winner === null) { winner = "Draw"; }
  else if (winner === 'X') { winner = "Player"; }
  else if (winner === 'O') { winner = "Computer"; }

  console.log("Winner:", winner);
  console.log(game);

  return winner;
}

window.resetBoard = async () => {
  let isComputer = Math.random() < 0.5;
  let turn = "Player"
  if (isComputer) { turn = "Computer"; }
  game = {
    "board": [["", "", ""], ["", "", ""], ["", "", ""]],
    "turn": turn,
    "winner": null
  }
  await postData(game);
  if (isComputer) { computerTurn(); } else { updateUI(); }
}

window.handleClick = async function (row, col) {
  console.log(`Cell clicked: (${row}, ${col})`);
  if (game.board[row][col] !== "") {
    console.log("Cell already occupied");
    return;
  }
  switch (game.turn) {
    case "Player":
      await playerTurn(row, col);
      await computerTurn();
      break;
    case "Computer":
      console.log("Computer's turn");
      await computerTurn();
      break;
    case "not loaded":
      console.error("Game has not loaded yet");
      break;
    default:
      console.error("unknown turn:", game.turn);
      break;
  }
}

window.addEventListener("load", async () => {
  game = await getData('/api/data');
  if (game.turn === "computer") { computerTurn(); }
  console.log(game);
  updateUI();
});