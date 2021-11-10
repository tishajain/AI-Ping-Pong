var paddle2 = 10,
  paddle1 = 10;

var paddle1X = 10,
  paddle1Height = 110;
var paddle2Y = 685,
  paddle2Height = 70;

var score1 = 0,
  score2 = 0;
var paddle1Y;

var playerscore = 0;
var audio1;
var pcscore = 0;

var ball = {
  x: 350 / 2,
  y: 480 / 2,
  r: 20,
  dx: 3,
  dy: 3
};

function restartGame() {
  location.reload(true);
}

function setup() {
  canvas = createCanvas(700, 600);
  canvas.parent("canvas");

  video = createCapture(VIDEO);
  video.size(800, 400);
  video.parent("game_console");

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function modelLoaded() {
  console.log("Model is loaded!");
}

var rightWristX = 0,
  rightWristY = 0,
  rightWristScore = 0;

function gotPoses(results) {
  if (results > 0) {
    console.log(results);
    rightWristX = results[0].pose.rightWrist.x;
    rightWristY = results[0].pose.rightWrist.y;
    rightWristScore = results[0].pose.keypoints[10].score;
    console.log("Right Wrist X = " + rightWristX);
    console.log("Right Wrist Y = " + rightWristY);
    console.log("Right Wrist Score = " + rightWristScore);
  }
}

function draw() {
  if (rightWristScore > 0.2) {
    fill("red");
    stroke("red");
    strokeWeight(2);
    circle(rightWristX, rightWristY, 20);
  }

  background(0);

  fill("black");
  stroke("black");
  rect(680, 0, 20, 700);

  fill("black");
  stroke("black");
  rect(0, 0, 20, 700);

  paddleInCanvas();


  fill(250, 0, 0);
  stroke("#FFA500");
  strokeWeight(1);
  paddle1Y = mouseY;
  rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100);

  fill("#FFA500");
  stroke(250, 0, 0);
  strokeWeight(1);
  var paddle2y = ball.y - paddle2Height / 2;
  rect(paddle2Y, paddle2y, paddle2, paddle2Height, 100);
midline();
drawScore();
models();
move();
}


function reset() {
  (ball.x = width / 2 + 100), (ball.y = height / 2 + 100);
  ball.dx = 3;
  ball.dy = 3;
}

function midline() {
  for (i = 0; i < 480; i += 10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width / 2, y + i, 10, 480);
  }
}

function drawScore() {
  textAlign(CENTER);
  textSize(20);
  fill("white");
  stroke(250, 0, 0);
  text("Player : " + playerscore, 100, 50);
  text("Computer : " + pcscore, 500, 50);
}

function move() {
  fill(50, 350, 0);
  stroke(255, 0, 0);
  strokeWeight(0.5);
  ellipse(ball.x, ball.y, ball.r, 20);
  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;
  if (ball.x + ball.r > width - ball.r / 2) {
    ball.dx = -ball.dx - 0.5;
  }
  if (ball.x - (2.5 * ball.r) / 2 < 0) {
    if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
      ball.dx = -ball.dx + 0.5;
    } else {
      pcscore++;
      reset();
      navigator.vibrate(100);
    }
  }
  if (pcscore == 4) {
    fill("#FFA500");
    stroke(0);
    rect(0, 0, width, height - 1);
    fill("white");
    stroke("white");
    textSize(25);
    text("Game Over! 🙁🙁", width / 2, height / 2);
    text("Reload The Page!", width / 2, height / 2 + 30);
    noLoop();
    pcscore = 0;
  }
  if (playerscore == 4) {
    fill("#FFA500");
    stroke(0);
    rect(0, 0, width, height - 1);
    fill("white");
    stroke("white");
    textSize(25);
    text("You Win!! 😀😀", width / 2, height / 2);
    text("Reload The Page!", width / 2, height / 2 + 30);
    noLoop();
    playerscore = 0;
  }
  if (ball.y + ball.r > height || ball.y - ball.r < 0) {
    ball.dy = -ball.dy;
  }
}

function models() {
  textSize(18);
  fill("white");
  noStroke();
  text("Speed : " + abs(ball.dx), 50, 25);
}

function paddleInCanvas() {
  if (mouseY + paddle1Height > height) {
    mouseY = height - paddle1Height;
  }
  if (mouseY < 0) {
    mouseY = 0;
  }
}
