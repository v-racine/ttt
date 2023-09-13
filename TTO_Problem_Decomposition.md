_Problem Description_

Tic Tac Toe is a 2-player game played on a 3x3 grid called the board. Each player takes a turn and marks a square on the board. The first player to get 3 squares in a row–horizontal, vertical, or diagonal–wins. If all 9 squares are filled and neither player has 3 in a row, the game is a tie.

_Sequence of Gameplay_

1. Display the initial empty 3x3 board.
2. Ask the user to mark a square.
3. Computer marks a square.
4. Display the updated board state.
5. If it's a winning board, display the winner.
6. If the board is full, display tie.
7. If neither player won and the board is not full, go to #2
8. Play again?
9. If yes, go to #1
10. If no, Goodbye!

From this sequence, we can see that there are two main loops:

- An inner loop between steps #2 and #7 that repeats as long as there is no winner and the board isn't full.

- An outer loop between steps #1 and #9 that repeats as long as the player wants to keep playing.

_Flowchart_

_Bonus Features_

1. Improved "join"

Write a function named `joinOr` that produces the following results:

```js
joinOr([1, 2, 3]); // => "1, 2, or 3"
joinOr([1, 2, 3], "; "); // => "1; 2; or 3"
joinOr([1, 2, 3], ", ", "and"); // => "1, 2, and 3"
joinOr([]); // => ""
joinOr([5]); // => "5"
joinOr([1, 2]); // => "1 or 2"
```

PEDAC:

- Inputs
  An array that contains the list of values
  A delimiter (default is a comma followed by a space)
  A join word (default is 'or')

- Outputs
  A string that represents the final string

- Algorithm
  if input array is empty, return an empty string
  if input array only has one value, return that value as a string
  if input array has exactly two values, return those values separated by the join word; don't use delimiter
  if input array has three or more values, return the concatenation of all of the values as follows:
  Add the delimiter between each pair of values
  Add the join word before the last value

- Examples/Test Cases
  See the test cases above.

2. Keep Score (five wins)

- Inputs
  a number that represents when a player wins the game and is updated each time the player wins a game
  a number that represents when the computer wins the game and is updated each time the computer wins a game

- Outputs
  a string message that delcares the winner of the match

- Algorithm
  the first player to win 5 games wins the overall match
  the score should reset to 0 for each player when beginning a new match
  don't use any global variable, but you may use a global constant to represent the number of games needed to win the match

3. Improve Play-Again Handling

Modify the program so that it only accepts `y`, `Y`, `n`, or `N` as valid inputs, and issues an error message for anything else.

Consider what happens when the user enters something that begins with `n` or `y` but isn't unambiguously a yes/no response, such as `yellow` or `narwhale`.

- Improve Game Loop

```js
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
```

- create two new functions `chooseSquare` and `alternatePlayer`

- (?) add feature to make player and computer choice consecutive (see Step 4)
