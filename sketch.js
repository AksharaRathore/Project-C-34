const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var fruit_con4;
var rope3;
var rope4;
var tryAgain;

var bg_img;
var food;
var rabbit;

var button, button2, button3,button4;
var bunny;
var blink, eat, sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var star1;
var star2;
var star_img;
var starsCollected;

function preload() {
  bg_img = loadImage('background.jpg');
  food = loadImage('carrot.png');
  rabbit = loadImage('Rabbit-01.png');
  star_img = loadImage('star.png');

  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');
  tryAgain = loadSound('try again.mp3');

  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  empty_star = loadAnimation("empty.png");
  one_star = loadAnimation("one_star.png");
  two_star = loadAnimation("stars.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  starsCollected =0;

  //btn 1
  button = createImg('cut_btn.png');
  button.position(600, 90);
  button.size(50, 50);
  button.mouseClicked(drop);

  //btn 2
  button2 = createImg('cut_btn.png');
  button2.position(950, 90);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(400, 200);
  button3.size(50, 50);
  button3.mouseClicked(drop3);

 



  rope = new Rope(6, { x: 600, y: 90 });
  rope2 = new Rope(9, { x: 1000, y: 90 });
  rope3 = new Rope(8, { x: 400, y: 200 });
  

  mute_btn = createImg('mute.png');
  mute_btn.position(width - 80, 20);
  mute_btn.size(60, 60);
  mute_btn.mouseClicked(mute);

  ground = new Ground(300, height, width, 20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(width/2, height - 140, 100, 100);
  bunny.scale = 0.3;

  bunny.addAnimation('blinking', blink);
  bunny.addAnimation('eating', eat);
  bunny.addAnimation('crying', sad);
  bunny.changeAnimation('blinking');

  star_display = createSprite(50, 20, 30, 30);
  star_display.scale = 0.2;
  star_display.addAnimation('empty_star', empty_star);
  star_display.addAnimation('one_star', one_star);
  star_display.addAnimation('two_star', two_star);
  star_display.changeAnimation('empty_star');

  //star sprite
  star1 = createSprite(600, 60, 20, 20);
  star1.addImage(star_img);
  star1.scale = 0.03;

  star2 = createSprite(600, 330, 20, 20);
  star2.addImage(star_img);
  star2.scale = 0.03;

  blower = createImg('baloon2.png');
  blower.position(400, 370);
  blower.size(120, 120);
  blower.mouseClicked(airblow);

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con_2 = new Link(rope2, fruit);
  fruit_con_3 = new Link(rope3, fruit);
  


  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)

}

function draw() {
  background(51);
  image(bg_img, 0, 0, width, height);

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(food, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  rope.show();
  rope2.show();
  rope3.show();
 

  Engine.update(engine);
  ground.show();

  drawSprites();

  if (collide(fruit, bunny, 80) == true) {
    World.remove(engine.world, fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if (fruit != null && fruit.position.y >= 600) {
    bunny.changeAnimation('crying');
    bk_song.stop();
    
    fruit = null;
    
    gameOver();
  }

  if (collide(fruit, star1, 20) == true && (collide(fruit, star2, 40) == true)) {
    starsCollected = 2;
  }

  if (collide(fruit, star1, 20) == true || (collide(fruit, star2, 40) == true)) {
    starsCollected =1;
  }
 
  


  
    
      //to make the collected star invisible
      if (collide(fruit, star2, 40) == true) {
        star2.visible = false;
        
      }
      if (collide(fruit, star1, 20) == true) {
        star1.visible = false;
        
   
    
    }

   

 //check the number of stars collected
 if (starsCollected == 1) {
  star_display.changeAnimation('one_star');
}
else if (starsCollected == 2) {
    star_display.changeAnimation('two_star');
  }
}



function drop() {
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

function drop3() {
  cut_sound.play();
  rope3.break();
  fruit_con_3.dettach();
  fruit_con_3 = null;
}





function collide(body, sprite, x) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= x) {
      return true;
    }
    else {
      return false;
    }
  }
}


function mute() {
  if (bk_song.isPlaying()) {
    bk_song.stop();
  }
  else {
    bk_song.play();
  }
}

function airblow() {
  Matter.Body.applyForce(fruit, { x: 0, y: 0 }, { x: 0, y: -0.03 });
  air.play();
}


function gameOver() {
  sad_sound.play();

  tryAgain.play();

  swal(
    {
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/PiratesInvision/main/assets/board.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}



