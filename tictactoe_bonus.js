const readline = require("readline-sync");
const { joinOr } = require("./joinOr");

const EMPTY_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";
const WINNING_LINES = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9], // rows
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9], // columns
  [1, 5, 9],
  [3, 5, 7], // diagonals
];

const FIRST_MOVE = ["me", "you"];
const PLAYER = "me";
const COMPUTER = "you";

//const END_OF_MATCH = 5;

// const MESSAGES = {
//   playerWinsGame: "You win this game!",
//   compWinsGame: "I win this game!",
//   tieMsg: "It's a tie!",
//   playerWinsMatch: "You win the match!",
//   compWinsMatch: "I win the match!",
// };

//main function

function getFirstMove() {
  let playerIsStarter = PLAYER;
  let computerIsStarter = COMPUTER;

  printMessage("Who gets the first turn? me or you?");
  //printMessage(`(${FIRST_MOVE[0]}) or ` + `(${FIRST_MOVE[1]})`);

  let firstPlayer = readline.question().toLowerCase();

  while (
    !FIRST_MOVE[0].includes(firstPlayer) &&
    !FIRST_MOVE[1].includes(firstPlayer)
  ) {
    printMessage("Wait, what? Try again: 'me' or 'you'?");
    firstPlayer = readline.question().toLowerCase();
  }

  if (FIRST_MOVE[0].includes(firstPlayer)) return playerIsStarter;

  if (FIRST_MOVE[1].includes(firstPlayer)) return computerIsStarter;
}

function startTicTacToe() {
  greeting();

  let initialPlayer = getFirstMove();

  let anotherGame = "y";

  while (anotherGame[0] === "y") {
    let board = initializeBoard();

    mainGameLoop(board, initialPlayer); // meh m mouton, please stop calling someoneWon a million times

    printWinner(board);

    anotherGame = keepPlaying(anotherGame);
  }
  farewell();
}

startTicTacToe();

//helper functions

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = EMPTY_MARKER;
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

function mainGameLoop(board, firstPlayer) {
  while (true) {
    displayBoard(board);

    if (firstPlayer === COMPUTER) {
      computerChoosesSquare(board);
      if (someoneWon(board) || boardFull(board)) break;
    }

    displayBoard(board);

    playerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;

    if (firstPlayer === PLAYER) {
      computerChoosesSquare(board);
      if (someoneWon(board) || boardFull(board)) break;
    }
  }
}

function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === EMPTY_MARKER);
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

function findRiskySquare(line, board, marker) {
  let markersInLine = line.map((square) => board[square]);
  let filteredMarkers = markersInLine.filter((mark) => mark === marker);

  if (filteredMarkers.length === 2) {
    let emptySquare = line.find((square) => board[square] === EMPTY_MARKER);
    if (emptySquare !== undefined) {
      return emptySquare;
    }
  }
  return null;
}

function computerChoosesSquare(board) {
  let square;

  //offensive strategy
  for (let i = 0; i < WINNING_LINES.length; i++) {
    let line = WINNING_LINES[i];
    square = findRiskySquare(line, board, COMPUTER_MARKER);
    if (square) break;
  }

  //defensive strategy
  if (!square) {
    for (let i = 0; i < WINNING_LINES.length; i++) {
      let line = WINNING_LINES[i];
      square = findRiskySquare(line, board, HUMAN_MARKER);
      if (square) break;
    }
  }

  //pick square #5 (if available) or random pick
  if (!square) {
    if (board["5"] === EMPTY_MARKER) {
      board["5"] = COMPUTER_MARKER;
    } else {
      let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
      square = emptySquares(board)[randomIndex];
    }
  }
  board[square] = COMPUTER_MARKER;
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

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
  displayBoard(board);
  if (someoneWon(board)) {
    printMessage(`${detectWinner(board)} won!`);
  } else {
    printMessage("It's a tie!");
  }
}

function keepPlaying(anotherGame) {
  let validYesOrNo = ["yes", "no"];

  printMessage(
    `Do you want to play again? Choose ${validYesOrNo.join(" or ")}.`
  );
  anotherGame = readline.question().toLowerCase();

  while (
    !validYesOrNo.includes(anotherGame) &&
    anotherGame !== "n" &&
    anotherGame !== "y"
  ) {
    printMessage("Please choose: 'yes' or 'no'.");
    anotherGame = readline.question().toLocaleLowerCase();
  }
  return anotherGame;
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
