// add cookies for records 
function getCookie(name){
  // split cookie string to individual name=value in the array
  var cookieArr = document.cookie.split(";");
  
  //loop the array for getting seprate value
  for(var i=0;i<cookieArr.length;i++){
    var cookiePair = cookieArr[i].split("=");

    // remove whitespace
    if(name==cookiePair[0].trim()){
      // decode
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

var records = JSON.parse(getCookie('records'))
if(records == undefined){
  records = 0
  console.log('cart is created')
  document.cookie = "records="+ JSON.stringify(records) + ";domain=;path=/"
}

let highscore = records;

const dead = new Audio();
dead.src = "src/audio/dead.mp3";
const nav = new Audio();
nav.src = "src/audio/up.mp3";
const eat = new Audio;
eat.src = "src/audio/eat.mp3";


const canv = document.getElementById("snake");
const ctx = canv.getContext("2d");

// create a unit
const box = 32;

// load image
const ground = new Image();
ground.src = "src/images/ground.png";

const foodImg = new Image();
foodImg.src = "src/images/food.png";

// create a snake
let snake = [];

snake[0]= {
    x : 9*box,
    y : 10*box,
};

// create a food

let food = {
    x : Math.floor(Math.random()*17+1)*box,
    y : Math.floor(Math.random()*15+3)*box,
};

let score = 0;

let d;
// control the snake
document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if(key == 37 && d != "RIGHT"){
        d = "LEFT";
        nav.play()
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        nav.play()          
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        nav.play()
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        nav.play()
    } 
}

function collition(head, array){
    for(let i=0; i<array.length; i++){
        if (head.x == array[i].x && head.y == array[i].y){
            return true
        }
    }
    return false
}

function draw() {

    ctx.drawImage(ground,0,0);

    for(let i=0; i<snake.length; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "yellow";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg,food.x,food.y);

    // old head
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

        // direction to move 
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // if snake eat the food 
    if(snakeX == food.x && snakeY == food.y){
        eat.play()
        score++;
        food = {
            x : Math.floor(Math.random()*17+1)*box,
            y : Math.floor(Math.random()*15+3)*box,
        };
    }else{
        // remove the tail 
        snake.pop();    
    }
    if(score > records){
        records = score;
        console.log('cart is created')
        document.cookie = "records="+ JSON.stringify(records) + ";domain=;path=/"
        highscore = records;
    }else{
        highscore = highscore;
    }

    let newHead = {
        x : snakeX,
        y : snakeY
    };


    // game rules 
    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collition(newHead,snake)){
        clearInterval(game);
        dead.play()
        ctx.fillStyle = "red";
        ctx.font = "60px Changa one";
        ctx.fillText("Game Over",5*box,10*box)
        ctx.fillStyle = "black";
        ctx.font = "30px Changa one";
        ctx.fillText("press space to play again",5*box,12*box)
        document.addEventListener("keydown",playAgain);
        function playAgain(event){
            let reset = event.keyCode;
            if(reset == 32){
                console.log('you press the space')
                location.reload()
            }
        }   
    }
    
    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
    ctx.font = "38px Changa one";
    ctx.fillText("Highscore : ",11*box,1.6*box);
    ctx.fillText(highscore,17*box,1.6*box)

}
        
let game = setInterval(draw,150);