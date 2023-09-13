/*SET-UP & DISPLAY THE BOARD*/

//Display an empty board:

// console.log("");
// console.log("     |     |");
// console.log("     |     |");
// console.log("     |     |");
// console.log("-----+-----+-----");
// console.log("     |     |");
// console.log("     |     |");
// console.log("     |     |");
// console.log("-----+-----+-----");
// console.log("     |     |");
// console.log("     |     |");
// console.log("     |     |");
// console.log("");

//Display board for an in-progress game:

// function displayBoard() {
//   console.log("");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("-----+-----+-----");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("-----+-----+-----");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("     |     |");
//   console.log("");
// }

// displayBoard();

/*
The `displayBoard` function isn't an interesting function at this point since it can 
only display the initial state where no squares are in use. This function probably 
needs a board as an argument and should display a grid based on that argument. 
However, how do we represent a board with a *JavaScript data structure*?
Let's create an object!
*/

// let board = {
//   1: "X", // top left
//   2: "O", // top center
//   3: "X", // top right
//   4: " ", // middle left
//   5: "O", // center
//   6: "X", // middle right
//   7: " ", // bottom left
//   8: " ", // bottom center
//   9: "X", // bottom right
// };

// console.log(board);

//Now, it's time to update our function to take in `board` as an argument:

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

// displayBoard(board);

//Create a new board:

/*
We've decided on the data structure to represent the board as well as a function 
`displayBoard` that takes a board object and displays a grid that represents the 
object.
Now, let's create a function that returns an initial board object. The initial board
object should contain only the string `" "` as values.
*/

function initializeBoard() {
  let initialBoard = {};

  for (let square = 1; square <= 9; square++) {
    initialBoard[String(square)] = " ";
  }

  return initialBoard;
}

let board = initializeBoard();
displayBoard(board);
