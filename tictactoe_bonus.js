const readline = require("readline-sync");
const { joinOr } = require("./joinOr");
const {
  EMPTY_MARKER,
  HUMAN_MARKER,
  COMPUTER_MARKER,
  WINNING_LINES,
  FIRST_MOVE,
  PLAYER,
  COMPUTER,
  END_OF_TOURNAMENT,
} = require("./constants");

//main function - starts the best-of-five tournament

function playTicTacToeTournament() {
  greeting();

  const SCOREBOARD = { playerScore: 0, compScore: 0 };

  let initialPlayer = getFirstMove();
  let anotherGame = "y";

  while (anotherGame[0] === "y") {
    while (
      SCOREBOARD.playerScore !== END_OF_TOURNAMENT &&
      SCOREBOARD.compScore !== END_OF_TOURNAMENT
    ) {
      let board = initializeBoard();

      const winner = mainGameLoop(board, initialPlayer);

      scoreTracker(winner, SCOREBOARD);
      printWinner(board, winner);
      displayScores(SCOREBOARD);
      displayTournamentWinner(SCOREBOARD);
    }
    anotherGame = keepPlaying(anotherGame);

    console.clear();
    SCOREBOARD.playerScore = 0;
    SCOREBOARD.compScore = 0;
  }
  farewell();
}

playTicTacToeTournament();

//helper functions:

function scoreTracker(winner, SCOREBOARD) {
  if (winner === "You") {
    SCOREBOARD.playerScore++;
  } else if (winner === "I") {
    SCOREBOARD.compScore++;
  }
}

function displayScores(SCOREBOARD) {
  printMessage(
    `Your score is ${SCOREBOARD.playerScore}. My score is ${SCOREBOARD.compScore}.`
  );
  console.log("SCOREBOARD:", SCOREBOARD);
}

function displayTournamentWinner(SCOREBOARD) {
  if (SCOREBOARD.playerScore === END_OF_TOURNAMENT) {
    printMessage("You win the game!");
  }
  if (SCOREBOARD.compScore === END_OF_TOURNAMENT) {
    printMessage("I win the game!");
  }
}

//to determine & validate who gets the first move
function getFirstMove() {
  let playerIsStarter = PLAYER;
  let computerIsStarter = COMPUTER;

  printMessage(`Who shall get the first turn? ${FIRST_MOVE.join(" or ")}?`);

  let firstPlayer = readline.question().toLowerCase();

  while (
    !FIRST_MOVE.includes(firstPlayer) &&
    firstPlayer !== "m" &&
    firstPlayer !== "y"
  ) {
    printMessage("Please choose: 'me' or 'you'.");
    firstPlayer = readline.question().toLocaleLowerCase();
  }

  if (FIRST_MOVE[0].includes(firstPlayer)) return playerIsStarter;
  if (FIRST_MOVE[1].includes(firstPlayer)) return computerIsStarter;
}

//to create board
function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = EMPTY_MARKER;
  }

  return board;
}

//to display board
function displayBoard(board) {
  console.log(`You are ${HUMAN_MARKER}. I am ${COMPUTER_MARKER}.`);

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

//to play one round
function mainGameLoop(board, firstPlayer) {
  let winner;
  while (true) {
    if (firstPlayer === COMPUTER) {
      computerChoosesSquare(board);
      winner = detectWinner(board);
      if (winner || boardFull(board)) {
        break;
      }
    }

    displayBoard(board);

    playerChoosesSquare(board);
    winner = detectWinner(board);
    if (winner || boardFull(board)) {
      break;
    }

    if (firstPlayer === PLAYER) {
      computerChoosesSquare(board);
      winner = detectWinner(board);
      if (winner || boardFull(board)) {
        break;
      }
    }
  }
  return winner;
}

//to get & validate player's choice
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

//to get computer's choice
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

//to play defense
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

//to determine a completed winning line on the board
function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return "You";
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return "I";
    }
  }

  return null;
}

//to determine when board is full (no winner)
function boardFull(board) {
  return emptySquares(board).length === 0;
}

//to determine when board has no more available squares
function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === EMPTY_MARKER);
}

//to display the result of one round (winner or tie)
function printWinner(board, winner) {
  displayBoard(board);
  if (winner) {
    printMessage(`${winner} won this round!`);
  } else {
    printMessage("It's a tie!");
  }
}

//to determine & validate playing another game
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

//to greet player
function greeting() {
  printMessage(
    "Welcome to the game of Tic-Tac-Toe! Let's play a Best-of-Five tournament!!"
  );
}

//to say goodbye to player
function farewell() {
  printMessage("Thanks for playing Tic-Tac-Toe! Arrivederci!!");
}

//to display messages to player
function printMessage(message) {
  console.log(`=> ${message}`);
}
