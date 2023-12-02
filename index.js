

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);
document.addEventListener('keydown', onKeyDown);

// Create a new texture
const texture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');

const sprite = new PIXI.Sprite(texture);
// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;


let x=10; 
let y=10;
let direction = "left"

function onKeyDown(key) {
    console.log(key);
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
    const tmp = new PIXI.Sprite(texture);    
    container.addChild(tmp)
    tmp.position.x = x;
    tmp.position.y = y;
    snake.unshift(tmp);
    //debugger;
    console.log(snake.length,snake.length>length )
     if(snake.length>length){
        let old = snake.pop()
        console.log(old)
        container.removeChild(old)
     }

     
}
let step=3;

container.addChild(sprite)

// Listen for animate update
app.ticker.add((delta) =>
{    
    sleepFor(60)
    if (direction=="up" && y>-100){
        y= y-step;
        addToSnake(x,y,snake);
    }
    if (direction=="down" && y<200){
        y= y+step;
        addToSnake(x,y,snake);    }
    if (direction=="left" && x>0){
        x= x-step;
        addToSnake(x,y,snake);
    }
    if (direction=="right" && x<200){
        x= x+step;
        addToSnake(x,y,snake);
        console.log(snake)
    }
   sprite.position.x = x;
   sprite.position.y = y;
   // container.rotation -= 0.01 * delta;
});
app.ticker.speed = .1;
