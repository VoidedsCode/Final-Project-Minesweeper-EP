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
victory sound. For final changes, I will attempt to add a numbering system, where empty revealed
cells will show how many mines the tile is near.
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
            //initializing default boolean values for the array
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

/*this function uses the array created by the first function to create a grid for the UI.
this part was a little complex, so I researched how to create the code in the nested for loops
https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
*/

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
    /*I had to research how to do this part, because the grid was not creating a box shape,
    only creating a grid as a long line going down and not a square. I figured out that
    I had to use an inline style statement to do this
    https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
    */
    game.style.setProperty("--cols", cols);
    game.style.setProperty("--rows", rows);
}

//this function adds a number to the revealed cell that determines how many mines it is near.
function countNearbyMines(row, col) {
    let count = 0;

    /*uses nested for-loops to determine how many mines are surrounding a cell, by creating a
    variable that is one next to the cell vertically or horizontally*/
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {

            /*uses continue to end the loop if the current index of rows and/or columns
            is either out of bounds or if it is the cell's location*/
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
            if (r === row && c === col) continue;

            //adds the mine to the number of mines near a cell
            if (board[r][c].mine) {
                count++;
            }
        }
    }

    return count;
}

//this function reveals the tiles and shows a bomb emoji if the tile was a mine, along with using
//correlating sounds for an empty tile and a mine one
let revealSound = new Audio('/assets/reveal.wav');
function onReveal(r, c) {
    /*if(argument) return essentially acts as a break statement. It ends the function, if the
    argument is valid. For example, here, if the game is over, the onReveal function does not work*/
    if (gameOver) return;

    const tile = board[r][c];
    const cellDiv = document.getElementById(`cell-${r}-${c}`);
    
    if (tile.flagged || tile.revealed) return;
    tile.revealed = true;
    revealedNum++;
    //used https://developer.mozilla.org/en-US/docs/Web/API/Element/classList to research classList
    cellDiv.classList.add("revealed");
    if (tile.mine) {
        cellDiv.textContent = "💣"; //adds mine cell to revealed class and creates an emoji within it
        ifGameOver(); //triggers game over function if revealed tile is a mine
        return;
    }
    /*uses the countNearbyMines function and assigns a number to the revealed cell's content
    if the cell is near a mine*/
    let nearby=countNearbyMines(r,c);
    tile.near=nearby;
    cellDiv.innerText = nearby > 0 ? nearby : "";

    //if the tile is clear, it plays a default sound and checks if the player won
    revealSound.play();
    checkWin();
}

let flagSound = new Audio('/assets/flag-plant.wav');
//implements the flag option for the user
function onFlag(menu, r, c) {
    /*I did not know this operator until I researched how to implement a right-click without showing
    the context menu
    https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    */
    menu.preventDefault();

    const tile = board[r][c];
    const cell = document.getElementById(`cell-${r}-${c}`);

    if (tile.revealed) return;

    //flags the cell or doesn't flag it depending on user choice and plays its correlating sound
    tile.flagged = !tile.flagged;
    cell.textContent = tile.flagged ? "🚩" : "";
    flagSound.play()
}
let mineSound = new Audio('/assets/explosion.wav');
function ifGameOver(){
    gameOver=true;
    console.log("Player has revealed a mine!");
    mineSound.play();
    //checks every cell for mines using a nested for loop
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

let winSound = new Audio('/assets/victory.wav')
function checkWin() {
    //calculates total cells and subtracts the mines from it to determine the number of empty cells
    let totalCells = rows * cols;
    let safeCells = totalCells - mines;

    //player wins if the number of revealed cells is equal to the number of empty ones and if
    //gameOver is false
    if (revealedNum === safeCells && !gameOver) {
        winSound.play();
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

function restartGame() {
    revealedNum = 0;
    gameOver = false;

    //this line clears the document for the fucntions to start fresh
    game.innerHTML = "";

    //this rebuilds the board
    createEmptyBoard();
    placeMines();
    buildGrid();
}


/*
Overall, this project has been a bit more complex than I planned it to be, but I managed to utilize
learned skills from this class and other programming languages I have learned, along with some
researched code, to start a barebones prototype for Minesweeper. For a game so simple, it utilizes a
lot of logic to build its code and it has been an interesting, yetchallenging project so far that
I look forward to continuing and building further.
*/