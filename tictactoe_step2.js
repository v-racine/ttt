/*PLAYER & COMPUTER TURN*/

const readline = require("readline-sync");

const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";

function prompt(message) {
  console.log(`=> ${message}`);
}

//The next step is to implement a way to ask the human player to select
//a square to mark, then have the computer choose its square.

//So far, we have:

function displayBoard(board) {
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

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }

  return board;
}

function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === INITIAL_MARKER);
}

//PLAYER'S CHOICE:
/*The The first thing to think about is the function's input--its arguments.
We'll need to pass a board object to the function since we must mutate the
board after the player chooses a square:*/

/*
Handling invalid inputs:
The first (simple) implementation of `playerChoosesSquare` has some problems:

If the player enters something other than a number between 1 and 9, it adds an unnecessary key 
to the board object. However, it doesn't complain about the incorrect input.
If a square has already been chosen, the function doesn't prevent the player from choosing that 
square again.
*/

function playerChoosesSquare(board) {
  let square; //declared here to use outside the loop

  // let emptySquares = Object.keys(board).filter(
  //   (key) => board[key] === INITIAL_MARKER
  // );
  //console.log(emptySquares.join(", "));

  while (true) {
    prompt(`Choose a square (${emptySquares(board).join(", ")})`);
    square = readline.question().trim();

    if (emptySquares(board).includes(square)) break; //break if it's a valid square (1-9)

    prompt("Sorry, that's not a valid choice. Pick a number between 1 and 9.");
  }
  board[square] = HUMAN_MARKER;
}

//COMPUTER'S TURN:

function computerChoosesSquare(board) {
  // let emptySquares = Object.keys(board).filter(
  //   (key) => board[key] === INITIAL_MARKER
  // ); //since we're using the same expression in both `playerChoosesSquare` and `computerChoosesSquare`,
  //we should extract it to a separate function (see below)

  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);

  let square = emptySquares(board)[randomIndex];
  board[square] = COMPUTER_MARKER;
}

let board = initializeBoard();
displayBoard(board);

playerChoosesSquare(board);
computerChoosesSquare(board);

displayBoard(board);
