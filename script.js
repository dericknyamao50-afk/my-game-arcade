//GET EVERYTHING FROM THE HTML FILE
const canvas=document.getElementById('game-canvas');
const ctx=canvas.getContext('2d');
const scoreElement=document.getElementById('score');
const shotsElement=document.getElementById('shots');
const messageElement=document.getElementById('message');
const restartButton=document.getElementById('restart-button');

//GAME NUMBERS
let score=0;
let shots=0;
let aimX=300;
let aimY=200;
let gameOver=false;

//BALL STARTS AT BOTTOM
let ball={x: 300, y: 340, radius: 12, moving: false, speed: 5, dx: 0, dy: 0};
//KEEPER IN THE MIDDLE
let keeper={x: 300, y: 80, target: 300,};

//DRAW EVERYTHING
function draw(){
    ctx.fillStyle='green';
    ctx.fillRect(0,0,600,400);
    
    //GOAL POST-WHITE LINE
    ctx.fillStyle='white';
    ctx.fillRect(170, 30, 260, 12);

    //keeper-red body + head
    ctx.fillStyle='blue';
    ctx.fillRect(keeper.x-15, keeper.y-15, 30, 30);
    ctx.beginPath();
    ctx.arc(keeper.x, keeper.y, 15, 0, Math.PI*2);
    ctx.fill();

    //ball-white
    ctx.fillStyle='white';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fill();

    //AIM CIRCLE-YELLOW,ONLY WHEN NOT SHOOTING
    if(!ball.moving && !gameOver){
        ctx.strokeStyle='yellow';
        ctx.lineWidth=3;
        ctx.beginPath();
        ctx.arc(aimX, aimY, 14, 0, Math.PI*2);
        ctx.stroke();
    }
}
// MOVE BALL +KEEPER
function update(){
    //keeper moves slowly to his target
    keeper.x += (keeper.target - keeper.x) * 0.08;

    //if ball is flying
    if(ball.moving){
        ball.x += (ball.tx-ball.x) * 0.12;
        ball.y += (ball.ty-ball.y) * 0.12;

    }
    //BALL ARRIVED AT TARGET
    if(Math.abs(ball.x-ball.tx)<5 && Math.abs(ball.y-ball.ty)<5){
        ball.moving = false;
        shots++;
        shotsElement.textContent = shots;
    
    }

    //DID KEEPER SAVE IT
    let saved=Math.abs(ball.x-keeper.x)<28
    if(saved){
        messageElement.textContent='Saved by the keeper!';

    }else{
        score++;
        scoreElement.textContent=score;
        messageElement.textContent='Goal!';
    }


//WAIT 1.2 SECONDS THEN RESET BALL
setTimeout(()=>{
    if(shots>=5){
        gameOver=true;
        messageElement.textContent='Game Over! Final Score: '+score;
    }else{
        ball={x: 300, y: 340, r: 12, moving: false,  dx: 0, dy: 0};
        keeper.x=300;
        messageElement.textContent='Take your next shot!';
    }
},1200);

}
draw();
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  aimX = e.clientX - rect.left;
  aimY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
  if (!ball.moving && !gameOver) {
        ball.moving = true;
    ball.dx = (aimX - ball.x) / 20;
    ball.dy = (aimY - ball.y) / 20;
  }
});

setInterval(() => { update(); draw(); }, 20);
