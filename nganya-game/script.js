const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let player = { x: 270, y: 360, w: 60, h: 70, speed: 8 };
let cars = [];
let coins = [];
let score = 0;
let fare = 0;
let lives = 3;
let gameOver = false;
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function spawnCar() {
  let x = Math.random() * 500 + 20;
  cars.push({ x: x, y: -80, w: 55, h: 70, speed: 3 + score / 200 });
}

function spawnCoin() {
  let x = Math.random() * 540 + 20;
  coins.push({ x: x, y: -30, r: 15 });
}

setInterval(spawnCar, 900);
setInterval(spawnCoin, 1500);

function update() {
  if (gameOver) return;

  if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && player.x > 10) player.x -= player.speed;
  if ((keys['ArrowRight'] || keys['d'] || keys['D']) && player.x < 530) player.x += player.speed;

  for (let i = cars.length - 1; i >= 0; i--) {
    cars[i].y += cars[i].speed;
    if (cars[i].y > 450) { cars.splice(i, 1); score += 10; }
    else if (player.x < cars[i].x + cars[i].w && player.x + player.w > cars[i].x &&
             player.y < cars[i].y + cars[i].h && player.y + player.h > cars[i].y) {
      cars.splice(i, 1);
      lives--;
      if (lives <= 0) {
        gameOver = true;
        document.getElementById('msg').innerText = "💥 CRASH! GAME OVER! Makanga amekasirika!";
      }
    }
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].y += 3;
    if (coins[i].y > 450) coins.splice(i, 1);
    else if (Math.abs(coins[i].x - (player.x + 30)) < 40 && Math.abs(coins[i].y - (player.y + 30)) < 40) {
      coins.splice(i, 1);
      fare += 50;
      score += 20;
    }
  }

  document.getElementById('score').innerText = score;
  document.getElementById('fare').innerText = fare;
  document.getElementById('lives').innerText = lives;
}

function draw() {
  ctx.clearRect(0, 0, 600, 450);

  ctx.fillStyle = "white";
  for (let y = 0; y < 450; y += 60) {
    ctx.fillRect(195, y, 8, 30);
    ctx.fillRect(395, y, 8, 30);
  }

  ctx.fillStyle = "gold";
  for (let c of coins) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText("50", c.x - 8, c.y + 4);
    ctx.fillStyle = "gold";
  }

  for (let car of cars) {
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.w, car.h);
    ctx.fillStyle = "lightblue";
    ctx.fillRect(car.x + 8, car.y + 12, car.w - 16, 20);
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = "magenta";
  ctx.fillRect(player.x + 5, player.y + 10, player.w - 10, 15);
  ctx.fillStyle = "black";
  ctx.font = "bold 14px Arial";
  ctx.fillText("NGANYA", player.x + 2, player.y + 45);
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x + 8, player.y + 50, player.w - 16, 15);
}

function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}
loop();