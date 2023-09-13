const readline = require("readline-sync");
const { joinOr } = require("./joinOr");

const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";
//const END_OF_MATCH = 5;

// const MESSAGES = {
//   playerWinsGame: "You win this game!",
//   compWinsGame: "I win this game!",
//   tieMsg: "It's a tie!",
//   playerWinsMatch: "You win the match!",
//   compWinsMatch: "I win the match!",
// };

//main function

function startTicTacToe() {
  greeting();

  //while (true) {
  let board = initializeBoard();

  mainGameLoop(board);

  printWinner(board);

  //   printMessage("Play again?");
  //   let answer = readline.question().toLowerCase()[0];
  //   if (answer !== "y") break;
  // }

  farewell();
}

startTicTacToe();

//helper functions

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }

  return board;
}

function displayBoard(board) {
  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}.`);

  console.log("");
  console.log("     |     |");
  console.log(`  ${board["1"]}  |  ${board["2"]}  |  ${board["3"]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${board["4"]}  |  ${board["5"]}  |  ${board["6"]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${board["7"]}  |  ${board["8"]}  |  ${board["9"]}`);
  console.log("     |     |");
  console.log("");
}

function mainGameLoop(board) {
  while (true) {
    displayBoard(board);

    playerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;

    computerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;
  }
}

function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === " ");
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
    printMessage(`Choose a square: ${joinOr(emptySquares(board))}`);
    square = readline.question().trim();
    if (emptySquares(board).includes(square)) break;

    printMessage("Sorry, that's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
}

function computerChoosesSquare(board) {
  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  let square = emptySquares(board)[randomIndex];
  board[square] = COMPUTER_MARKER;
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  let winningLines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9], // rows
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9], // columns
    [1, 5, 9],
    [3, 5, 7], // diagonals
  ];

  for (let line = 0; line < winningLines.length; line++) {
    let [sq1, sq2, sq3] = winningLines[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return "Player";
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return "Computer";
    }
  }

  return null;
}

function printWinner(board) {
  if (someoneWon(board)) {
    printMessage(`${detectWinner(board)} won!`);
  } else {
    printMessage("It's a tie!");
  }
}

function greeting() {
  printMessage("Welcome to the game of 'Tic-Tac-Toe'! Let's play!!");
}

function farewell() {
  printMessage("Thanks for playing Tic-Tac-Toe! Arrivederci!!");
}

function printMessage(message) {
  console.log(`=> ${message}`);
}
