const readline = require('readline-sync');
const {
  EMPTY_MARKER,
  HUMAN_MARKER,
  COMPUTER_MARKER,
  WINNING_LINES,
  FIRST_MOVE,
  PLAYER,
  COMPUTER,
  END_OF_TOURNAMENT,
  PLAYER_WINNER,
  COMPUTER_WINNER,
} = require('./constants');

/* MAIN FUNCTION */
// starts the best-of-five tournament

function playTicTacToeTournament() {
  greeting();

  const scoreBoard = { playerScore: 0, compScore: 0 };

  const initialPlayer = getFirstMove();
  let anotherGame = 'y';

  while (anotherGame[0] === 'y') {
    while (
      scoreBoard.playerScore !== END_OF_TOURNAMENT &&
      scoreBoard.compScore !== END_OF_TOURNAMENT
    ) {
      const board = initializeBoard();

      const winner = mainGameLoop(board, initialPlayer);

      scoreTracker(winner, scoreBoard);
      displayRoundWinner(board, winner);
      displayScores(scoreBoard);
      displayTournamentWinner(scoreBoard);
    }
    anotherGame = keepPlaying(anotherGame);

    console.clear();
    scoreBoard.playerScore = 0;
    scoreBoard.compScore = 0;
  }
  farewell();
}

playTicTacToeTournament();

/* HELPER FUNCTIONS */

// creates board
function initializeBoard() {
  const board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = EMPTY_MARKER;
  }

  return board;
}

// displays board
function displayBoard(board) {
  console.log(`You are ${HUMAN_MARKER}. I am ${COMPUTER_MARKER}.`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

// determines & validates who gets the first move
function getFirstMove() {
  const playerIsStarter = PLAYER;
  const computerIsStarter = COMPUTER;

  printMessage(`Who shall get the first turn? ${FIRST_MOVE.join(' or ')}?`);

  let firstPlayer = readline.question().toLowerCase();

  while (
    !FIRST_MOVE.includes(firstPlayer) &&
    firstPlayer !== 'm' &&
    firstPlayer !== 'y'
  ) {
    printMessage("Please choose: 'me' or 'you'.");
    firstPlayer = readline.question().toLowerCase();
  }

  if (FIRST_MOVE[0].includes(firstPlayer)) {
    return playerIsStarter;
  }

  return computerIsStarter;
}

// plays one round of tic-tac-toe
function mainGameLoop(board, firstPlayer) {
  let winner;
  while (true) {
    if (firstPlayer === COMPUTER) {
      computerChoosesSquare(board);
      winner = detectRoundWinner(board);
      if (winner || boardFull(board)) break;
    }

    displayBoard(board);

    playerChoosesSquare(board);
    winner = detectRoundWinner(board);
    if (winner || boardFull(board)) break;


    if (firstPlayer === PLAYER) {
      computerChoosesSquare(board);
      winner = detectRoundWinner(board);
      if (winner || boardFull(board)) break;
    }
  }
  return winner;
}

// determines & validates player's move
function playerChoosesSquare(board) {
  let square;

  while (true) {
    printMessage(`Choose a square: ${joinOr(emptySquares(board))}`);
    square = readline.question().trim();
    if (emptySquares(board).includes(square)) break;

    printMessage("Sorry, that's not a valid choice.");
  }

  return (board[square] = HUMAN_MARKER);
}

//helper for `playerChoosesSquare` (to display available squares)
function joinOr(array, delimiter = ", ", word = "or") {
  let arrCopy = array.slice();
  arrCopy.pop();

  switch (array.length) {
    case 0:
      return "";
    case 1:
      return `${array[0]}`;
    case 2:
      return `${array[0]} ${word} ${array[1]}`;
    default:
      return `${arrCopy.join(delimiter)}${delimiter}${word} ${
        array[array.length - 1]}`;
  }
}

// determines computer's move
function computerChoosesSquare(board) {
  let square;
  // offensive strategy
  compOffensiveMove(board, square);
  //defensive strategy
  if (!square) {
    for (let index = 0; index < WINNING_LINES.length; index++) {
      const line = WINNING_LINES[index];
      square = findRiskySquare(line, board, HUMAN_MARKER);
      if (square) break;
    }
  }
  // picks square #5 (if available) or random pick
  if (!square) {
    if (board['5'] === EMPTY_MARKER) {
      board['5'] = COMPUTER_MARKER;
    } else {
      const randomInd = Math.floor(Math.random() * emptySquares(board).length);
      square = emptySquares(board)[randomInd];
    }
  }
  (board[square] = COMPUTER_MARKER);
}

//helper for `computerChoosesSquare` (offensive strategy)
function compOffensiveMove(board, square) {
  for (let index = 0; index < WINNING_LINES.length; index++) {
    const line = WINNING_LINES[index];
    square = findRiskySquare(line, board, COMPUTER_MARKER);
    if (square) break;
  }

  (board[square] = COMPUTER_MARKER);
}

// helper for strategies in `computerChoosesSquare`
function findRiskySquare(line, board, marker) {
  const markersInLine = line.map((square) => board[square]);
  const filteredMarkers = markersInLine.filter((mark) => mark === marker);

  if (filteredMarkers.length === 2) {
    const emptySquare = line.find((square) => board[square] === EMPTY_MARKER);
    if (emptySquare !== undefined) {
      return emptySquare;
    }
  }
  return null;
}

// determines a completed winning line on the board (the winner of one round)
function detectRoundWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    const [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return PLAYER_WINNER;
    }

    if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return COMPUTER_WINNER;
    }
  }

  return null;
}

// determines when board is full (no winner)
function boardFull(board) {
  return emptySquares(board).length === 0;
}

// helper for `boardFull`
function emptySquares(board) {
  return Object.keys(board).filter((key) => board[key] === EMPTY_MARKER);
}

// displays the result of one round (winner or tie)
function displayRoundWinner(board, winner) {
  displayBoard(board);
  if (winner) {
    printMessage(`${winner} won this round!`);
  } else {
    printMessage("It's a tie!");
  }
}

// keeps track of round winners in best-of-five tournament
function scoreTracker(winner, SCOREBOARD) {
  if (winner === PLAYER_WINNER) {
    SCOREBOARD.playerScore++;
  } else if (winner === COMPUTER_WINNER) {
    SCOREBOARD.compScore++;
  }
}

// displays scoreboard to player
function displayScores(SCOREBOARD) {
  printMessage(
    `Your score is ${SCOREBOARD.playerScore}. My score is ${SCOREBOARD.compScore}.`,
  );
  console.log('SCOREBOARD:', SCOREBOARD);
}

// displays the winner of best-of-five tournament
function displayTournamentWinner(SCOREBOARD) {
  if (SCOREBOARD.playerScore === END_OF_TOURNAMENT) {
    printMessage('You are the new tournament champion!!');
  }
  if (SCOREBOARD.compScore === END_OF_TOURNAMENT) {
    printMessage('I am the tournament champion!');
  }
}

// determines & validates whether player wants to play another game
function keepPlaying(anotherGame) {
  const validYesOrNo = ['yes', 'no'];

  printMessage(
    `Do you want to play again? Choose ${validYesOrNo.join(' or ')}.`,
  );
  anotherGame = readline.question().toLowerCase();

  while (
    !validYesOrNo.includes(anotherGame) &&
    anotherGame !== 'n' &&
    anotherGame !== 'y'
  ) {
    printMessage("Please choose: 'yes' or 'no'.");
    anotherGame = readline.question().toLowerCase();
  }
  return anotherGame;
}

// greets player
function greeting() {
  printMessage(
    "Welcome to the game of Tic-Tac-Toe! Let's play a Best-of-Five tournament!",
  );
}

// says goodbye to player
function farewell() {
  printMessage('Thanks for playing Tic-Tac-Toe! Arrivederci!');
}

// displays messages to player with arrow
function printMessage(message) {
  console.log(`=> ${message}`);
}
