/*DETERMINING THE WINNER*/

//Here's what we have so far:

const readline = require("readline-sync");

const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";

function prompt(msg) {
  console.log(`=> ${msg}`);
}

function displayBoard(board) {
  console.clear();

  console.log(
    `You are '${HUMAN_MARKER}'. The computer is '${COMPUTER_MARKER}'.`
  );

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
  return Object.keys(board).filter((key) => board[key] === " ");
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square (${emptySquares(board).join(", ")}):`);
    square = readline.question().trim();
    if (emptySquares(board).includes(square)) break;

    prompt("Sorry, that's not a valid choice.");
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
  return !!detectWinner(board); //To return an explicit boolean, you can use the `!` operator twice
}

function detectWinner(board) {
  let winningLines = [
    [1, 2, 3], //row
    [4, 5, 6], //row
    [7, 8, 9], //row
    [1, 4, 7], //column
    [2, 5, 8], //column
    [3, 6, 9], //column
    [1, 5, 9], //diagonal
    [3, 5, 7], //diagonal
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

while (true) {
  let board = initializeBoard();

  while (true) {
    displayBoard(board);

    playerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;

    computerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;
  }

  displayBoard(board);

  /*
After the program breaks out of the main game loop, there are only two 
possibilities: either someone has won, or we have a full board. 

Assuming we have an implementation for `someoneWon`, let's handle those 
possibilities:
*/

  if (someoneWon(board)) {
    prompt(`${detectWinner(board)} won!`);
  } else {
    prompt("It's a tie!");
  }

  prompt("Play again? (y/n)");
  let answer = readline.question().toLowerCase();
  if (answer !== "y") break;
}

prompt("Thanks for playing Tic Tac Toe!");

/*
The `detectWinner` function will need to return the name of the winner in
the form of a string, or a value of `null` if neither player won. 

Thus, the `someoneWon` function can then use the return value of the 
`detectWinner` function:
*/

/*
It's finally time to write our `detectWinner` function.
The rules of the game say that a player wins when:

1. All three squares within any *row* are marked with the player's marker.
2. All three squares within any *column* are marked with the player's marker.
3. All three *diagonal* squares in either direction are marked with the player's marker.

Rewriting these rules in terms of our implementation, we can say that a player 
wins when any of the following sequences of squares all contain the player's 
marker:

1, 2, 3
4, 5, 6
7, 8, 9
1, 4, 7
2, 5, 8
3, 6, 9
1, 5, 9
3, 5, 7

We can use a *nested array* to represent these 8 winning combinations.

*/

// function detectWinner(board) {
//   let winningLines = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9], // rows
//     [1, 4, 7],
//     [2, 5, 8],
//     [3, 6, 9], // columns
//     [1, 5, 9],
//     [3, 5, 7],
//   ]; // diagonals

//   for (let line = 0; line < winningLines.length; line++) {
//     //We use a for loop here since we may need to return from the function before the end of the loop;
//     //`forEach` doesn't allow that since using `return` in the callback merely returns from the callback
// rather than the function.

//     let [sq1, sq2, sq3] = winningLines[line];

//     if (
//       board[sq1] === HUMAN_MARKER &&
//       board[sq2] === HUMAN_MARKER &&
//       board[sq3] === HUMAN_MARKER
//     ) {
//       return "Player";
//     } else if (
//       board[sq1] === COMPUTER_MARKER &&
//       board[sq2] === COMPUTER_MARKER &&
//       board[sq3] === COMPUTER_MARKER
//     ) {
//       return "Computer";
//     }

//     return null;
//   }
// }

/*IMPROVING THE GAME LOOP*/
//see main loop
