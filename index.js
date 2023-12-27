

const app = new PIXI.Application({ background: '#1099bb', width: 500, height: 500  });

document.getElementById("pixi-container").appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);
document.addEventListener('keydown', onKeyDown);

// Create a new texture
const texture_head = PIXI.Texture.from('snake_head.png');
const texture_body = PIXI.Texture.from('snake_body.png');
const texture_apple = PIXI.Texture.from('apple_image.png');
const texture_background = PIXI.Texture.from('tile_aqua.png');


const sprite_body = new PIXI.Sprite(texture_body);
const sprite_head = new PIXI.Sprite(texture_head);
const sprite_apple = new PIXI.Sprite(texture_apple);

//container.addChild(sprite_body)
// Move container to the center
//container.x = 500;
//container.y = 500;

// Center bunny sprite in local container coordinates
//container.pivot.x = 100;
//container.pivot.y = 100;

const tilingSprite = new PIXI.TilingSprite(
    texture_background,
    app.screen.width,
    app.screen.height,
);
container.addChild(tilingSprite);
let x=10; 
let y=10;
let direction = "left"
let apple_x = 250;
let apple_y = 250;
sprite_apple.x = apple_x
sprite_apple.y = apple_y
container.addChild(sprite_apple)
container.addChild(sprite_head)
function testForAABB(object1, object2)
{
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + 25
        && bounds1.x + 25 > bounds2.x
        && bounds1.y < bounds2.y + 25
        && bounds1.y + 25 > bounds2.y;
}


function onKeyDown(key) {
    // W Key is 87
    // Up arrow is 87
    if (key.keyCode === 87 || key.keyCode === 38) {
        // If the W key or the Up arrow is pressed, move the player up.
        if (y != 0) {
            // Don't move up if the player is at the top of the stage
            direction= "up"
        }
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
        // If the S key or the Down arrow is pressed, move the player down.
        if (y != container.height - 5) {
            // Don't move down if the player is at the bottom of the stage
            direction= "down"
        }
    }

    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
        // If the A key or the Left arrow is pressed, move the player to the left.
        if (x != 0) {
            // Don't move to the left if the player is at the left side of the stage
            direction= "left"
        }
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
        // If the D key or the Right arrow is pressed, move the player to the right.
        if (x != container.width - 5) {
            // Don't move to the right if the player is at the right side of the stage
            direction= "right"
        }
    }
}
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}
let snake=[]
let length=5;

function addToSnake(x,y,snake){
    const tmp = new PIXI.Sprite(texture_body);    
    container.addChild(tmp)
    container.addChild(sprite_head)
    tmp.position.x = x;
    tmp.position.y = y;
    snake.unshift(tmp);
     if(snake.length>length){
        let old = snake.pop()
        container.removeChild(old)
     }

     
}
let step=10;
let speed=60;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let points = 0;
let text_child;
function update_score() {
    if (text_child) container.removeChild(text_child)
    text_child = container.addChild(
        new PIXI.Text("Points: "+points, {
          fontSize: 24,
          lineHeight: 28,
          letterSpacing: 0,
          fill: 0xffffff,
          align: "center"
        })
      );
}

// Listen for animate update
app.ticker.add((delta) =>
{    
    sleepFor(speed)
    if (direction=="up" && y>0){
        y= y-step;
        addToSnake(x,y,snake);
    }
    if (direction=="down" && y<460){
        y= y+step;
        addToSnake(x,y,snake);    }
    if (direction=="left" && x>0){
        x= x-step;
        addToSnake(x,y,snake);
    }
    if (direction=="right" && x<460){
        x= x+step;
        addToSnake(x,y,snake);
    }

   sprite_head.position.x = x;
   sprite_head.position.y = y;
   // container.rotation -= 0.01 * delta;
   const collison = testForAABB(sprite_head, sprite_apple)
   if (collison) {
    sprite_apple.x = getRandomInt(0,460)
    sprite_apple.y = getRandomInt(0,460)
    length = length + 1
    points = points+1
    update_score() 
   }
});
app.ticker.speed = .1;
