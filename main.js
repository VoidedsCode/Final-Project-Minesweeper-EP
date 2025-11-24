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

let rows;
let cols;
let mines;
let revealedNum=0;
let gameOver=false;
const game = document.getElementById("game");

let board = [];

function displayMenu(){
    //this function displays the game's main menu and hides the game
    document.getElementById("menu").style.display="block";
    document.getElementById("container").style.display="none";

}

//the function that creates the game's array using nested for loops
function createEmptyBoard() {
    board = [];

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
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
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

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
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell-${r}-${c}`;
            board[r][c].element = cell;

            //reveals the tiles using the left click
            cell.addEventListener("click", () => onReveal(r, c));

            //flags the tiles using the right click
            cell.addEventListener("contextmenu", (menu) => onFlag(menu, r, c));

            game.appendChild(cell);
        }
    }
    //I had to research how to do this part, because the grid was not creating a box shape,
    //only creating a grid as a long line going down and not a square. I figured out that
    //I had to use an inline style statement to do this
    game.style.setProperty("--cols", cols);
    game.style.setProperty("--rows", rows);

}

//this function reveals the tiles and shows a bomb emoji if the tile was a mine

function onReveal(r, c) {
    if (gameOver) return;

    const tile = board[r][c];
    const cellDiv = document.getElementById(`cell-${r}-${c}`);
    //I was confused with implementing this part, but I found how to use an if return statement online
    if (tile.flagged || tile.revealed) return;

    tile.revealed = true;
    revealedNum++;

    //used https://developer.mozilla.org/en-US/docs/Web/API/Element/classList to research this
    cellDiv.classList.add("revealed");
    cellDiv.textContent = tile.mine ? "💣" : ""; //adds mine cell to revealed class and creates an emoji within it

    if (tile.mine) {
        ifGameOver(); //triggers game over function if revealed tile is a mine
        return;
    }

    checkWin();
}


//implements the flag option for the user
function onFlag(menu, r, c) {
    //I did not know this operator until I researched how to implement a right-click without showing
    //the context menu
    menu.preventDefault();

    const tile = board[r][c];
    const cell = document.getElementById(`cell-${r}-${c}`);

    if (tile.revealed) return;

    //flags the cell or doesn't flag it depending on user choice
    tile.flagged = !tile.flagged;
    cell.textContent = tile.flagged ? "🚩" : "";
}

function ifGameOver(){
    gameOver=true;
    console.log("Player has revealed a mine!");
    //checks every cell for mines
    for (let r=0; r < rows; r++){
        for (let c=0; c<cols; c++){
            if (board[r][c].mine){
                //checks if the cell is a mine and adds it to the mine class
                board[r][c].element.classList.add("mine");
            }
        }
    }
    alert("Game Over!");
}

function checkWin() {
    //calculates total cells and subtracts the mines from it to determine the number of empty cells
    let totalCells = rows * cols;
    let safeCells = totalCells - mines;

    //player wins if the number of revealed cells is equal to the number of empty ones and if
    //gameOver is false
    if (revealedNum === safeCells && !gameOver) {
        alert("You Win!");
        gameOver = true;
    }
}


//puts the functions together to start the game
function startGame(r, c, m) {
    rows = r;
    cols = c;
    mines = m;

    //inverts the startMenu function to hide the menu and display the game once started
    document.getElementById("menu").style.display="none";
    document.getElementById("container").style.display="block";
    createEmptyBoard();
    placeMines();
    buildGrid();
}

/*
Overall, this project has been a bit more complex than I planned it to be, but I managed to utilize
learned skills, along with some researched code, to start a barebones prototype for Minesweeper. For
a game so simple, it utilizes a lot of logic to build its code and it has been an interesting, yet
challenging project so far that I look forward to continuing and building further.
*/