/*
Eduardo Pizano

For my final project, I will be recreating minesweeper through Phaser. I will utilize a grid for the 
board. It will also be determined through an array that will be used with the grid to determine
empty/mine/flag cells.

The final product I plan on creating for the user would be a full-scale minesweeper game, complete
with all features from the classic game. It will be a simplistic design, using a grid for empty
cells, flagged cells, and exposed mines. I plan on trying to implement as many features to my current
ability, along with some research for issues I need help with, all while maintaining its minimalist
design.

The grid size and mine num will be defined initially. The prototype will be very barebones, with no
proper game over, just random generation of the tiles in the grid. To generate the random mines,
the program utilizes nested for loops to initialize the tiles at default, but also with random numbers
to plant mines. When the user left-clicks, the tile gets revealed. When the user right-clicks, a flag
emoji shows. The prototype will not have win-lose conditions, which I plan on adding during majority
implementation.

Along with game over/win, I also plan on adding a difficulty selector with increasing board sizes
and more mines. I will also styilize the game more, maybe adding sound effects for the mines and a
victory sound. For final changes, I will add a lives system and maybe a timer, changing with
difficulty. I may attempt to add the ability to reveal multiple empty cells at once, but I do not
know how complex that would be to implement.
*/

//declaring variables and array
const size = 8;
const mines = 10;
const game = document.getElementById("game");

let board = [];

//the function that creates the game's array using nested for loops
function createEmptyBoard() {
    board = [];

    for (let r = 0; r < size; r++) {
        board[r] = [];
        for (let c = 0; c < size; c++) {
            //initializing default boolean values for the array. I researched part of this code
            board[r][c] = {
                mine: false,
                revealed: false,
                flagged: false
            };
        }
    }
}

function placeMines() {
    let placed = 0;

    while (placed < mines) {
        //giving the rows and columns random values based on the grid's size. it uses a loop to
        //plant the specific number of mines in random grid locations
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);

        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }
}

//this function uses the array created by the first function to create a grid for the UI.
//this part was a little complex, so I researched how to create the code in the nested for loops
function buildGrid() {
    //nested for loop that
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${r}-${c}`;

            //reveals the tiles using the left click
            cell.addEventListener("click", () => onReveal(r, c));

            //flags the tiles using the right click
            cell.addEventListener("contextmenu", (menu) => onFlag(menu, r, c));

            game.appendChild(cell);
        }
    }
}

//this function reveals the tiles and shows a bomb emoji if the tile was a mine
function onReveal(r, c) {
    const tile = board[r][c];
    const cellDiv = document.getElementById(`cell-${r}-${c}`);

    //I was confused with implementing this part, but I researched 
    if (tile.flagged || tile.revealed) return;

    tile.revealed = true;
    cellDiv.classList.add("revealed");

    cellDiv.textContent = tile.mine ? "💣" : "";
}

//implements the flag option for the user
function onFlag(menu, r, c) {
    //I did not know this operator until I researched how to implement a right-click without showing
    //the context menu
    menu.preventDefault();

    const tile = board[r][c];
    const cell = document.getElementById(`cell-${r}-${c}`);

    if (tile.revealed) return;

    tile.flagged = !tile.flagged;
    cell.textContent = tile.flagged ? "🚩" : "";
}

//puts the functions together to start the game
function startGame() {
    createEmptyBoard();
    placeMines();
    buildGrid();
}

startGame();

/*
Overall, this project has been a bit more complex than I planned it to be, but I managed to utilize
learned skills, along with some researched code, to start a barebones prototype for Minesweeper. For
a game so simple, it utilizes a lot of logic to build its code and it has been an interesting, yet
challenging project so far that I look forward to continuing and building further.
*/