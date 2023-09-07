// input sudoku boards.
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function(){
  //run startGame function after button is clicked
  id("start-btn").addEventListener("click", startGame);
  // add functionality to tiles after being clicked
  for(let i = 0; i < id("number-container").children.length; i++){
    id("number-container").children[i].addEventListener("click", function(){
      // if select is not disabled
      if(!disableSelect){
        // if tile is selected then unselect it. 
        if(this.classList.contains("selected")){
          this.classList.remove("selected");
          selectedNum = null;
        }
        //else disselect the previously selected tile then select the clicked tile
        else{
          for(let i = 0; i < 9; i++){
            id("number-container").children[i].classList.remove("selected");
          }
          this.classList.add("selected");
          selectedNum = this;
          // action on player decision
          updateMove();
        }
      }
    });
  }
}

function id(id) {
  return document.getElementById(id);
}

function startGame(){
  let board;
  //select board based on difficulty
  if (id("dif1").checked) board = easy[0];
  else if (id("dif2").checked) board = medium[0];
  else board = hard[0];
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 3";
  //generates sudoku board puzzle with
  generteBoard(board);
  startTimer();
  //unhides the number list
  id("number-container").classList.remove("hidden");
}

function generteBoard(board) {
  //clear previous selections
  claearPrevious();
  let idCount = 0;
  //creat tiles for the board
  for(let i = 0; i < 81; i++){
    let tile = document.createElement("p");
    if (board.charAt(i) != "-"){
      tile.textContent = board.charAt(i);
    }
    else{
      //add click listener to the empty tiles
      tile.addEventListener("click", function(){
        if(!disableSelect){
          if(tile.classList.contains("selected")){
            tile.classList.remove("selected");
            selectedTile = null;
          }
          else{
            for(let i = 0; i < 81; i++){
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            // action on the player's decision
            updateMove();
          }
        }
      });
    }
    tile.id = idCount;
    idCount++;
    // divides board into 9 sub-boards with bold lines
    tile.classList.add("tile");
    if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
      tile.classList.add("bottomBorder");
    }
    if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
      tile.classList.add("rightBorder");
    }
    id("board").appendChild(tile);
  }
}
//validates players moves
function updateMove(){
  if(selectedNum && selectedTile){
    selectedTile.textContent = selectedNum.textContent;
    //if the correct number is selected
    if(isCorrect(selectedTile)){
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      selectedNum = null;
      selectedTile = null;
      //ends game if all the tiles are filled
      if(boardCompleted()) endGame();
    }
    // after selecting the wrong number
    else{
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      //wrong number disappears after 1 second.
      setTimeout(function (){
        lives--;
        if(lives === 0){
          endGame();
        }
        else{
          id("lives").textContent = "Lives Remaining: " + lives;
          disableSelect = false;
        }

        selectedTile.classList.remove("incorrect", "selected");
        selectedNum.classList.remove("selected");
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;

      }, 1000);
    }
  }
}
//checks if all the tiles are filled
function boardCompleted(){
  let tiles = qsa(".tile");
  for(let i = 0; i < tiles.length; i++){
    if(tiles[i].textContent === "") return false;
  }
  return true;
}
//ends the game
function endGame(){
  disableSelect = true;
  clearTimeout(timer);
  if(lives === 0 || timeRemaining === 0){
    id("lives").textContent = "You Lost!";
  }
  else{
    id("lives").textContent = "You Won!";
  }
}
//checks if the number entered matches the solution
function isCorrect(tile){
  let solution;
  if (id("dif1").checked) solution = easy[1];
  else if (id("dif2").checked) solution = medium[1];
  else solution = hard[1];   
  
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}
//unselect previously selected tile
function claearPrevious() {
  let tiles = qsa(".tile");
  for(let i = 0; i < tiles.length; i++){
    tiles[i].remove();
    if(timer) clearTimeout(timer);
    for(let i = 0; i < id("number-container").children.length; i++){
      id("number-container").children[i].classList.remove("selected");
    }
  }
  selectedNum = null;
  selectedTile = null;
}

function qs(selector){
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}
//manages timer
function startTimer() {
  if(id("time1").checked) timeRemaining = 180;
  else if(id("time2").checked) timeRemaining = 300;
  else timeRemaining = 600;
  id("timer").textContent = timeConversion(timeRemaining);
  timer = setInterval(function (){
    timeRemaining--;
    if(timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000)
}
//converts seconds to minutes:seconds format
function timeConversion(time){
  let minutes = Math.floor(time/60);
  if(minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if(seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}