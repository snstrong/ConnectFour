/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2

let board;

// let board = new Array(HEIGHT).fill(null); // this did not work

/** makeBoard: creates in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *    set "board" to empty HEIGHT x WIDTH matrix array
 */
function makeBoard() {
  return board = [[],[],[],[],[],[]];
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  let htmlBoard = document.getElementById('board');
  
  // Creates top row where click events will happen
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Builds 6 x 7 gameboard row by row
  // Assigns each cell's y,x coordinates as that cell's id
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // cell.innerText = cell.id;
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = 5; y >= 0; y--) {
    if (!document.getElementById(`${y}-${x}`).hasChildNodes()) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function makePiece() {
  let piece = document.createElement('div');
  piece.classList.add("piece");
  if (currPlayer === 1) {
    piece.classList.add("player1")
  }
  else {
    piece.classList.add("player2")
  }
  return piece;
}

function placeInTable(y, x) {
  // makes a div and inserts into correct table cell
  let cell = document.getElementById(`${y}-${x}`);
  cell.append(makePiece());
}

/** endGame: announce game end */

function endGame(msg) {
  return window.setTimeout(window.alert(msg), 500);
}

/** handleClick: handle click on column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`GAME OVER! Player ${currPlayer} wins!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  switchPlayer();
}

// Updates value of currPlayer
function switchPlayer() {
  return currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Creates arrays of potentially winning cell combinations, then checks them against the win conditions
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
