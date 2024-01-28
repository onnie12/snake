
const explosionTextures = [];




const app = new PIXI.Application({ background: '#1099bb', width: 500, height: 500  });

document.getElementById("pixi-container").appendChild(app.view);

const container = new PIXI.Container();
PIXI.Assets.load('https://pixijs.com/assets/spritesheet/mc.json').then(() =>
{
    let i;

    for (i = 0; i < 26; i++)
    {
        const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);

        explosionTextures.push(texture);
    }
});
app.stage.addChild(container);
document.addEventListener('keydown', onKeyDown);
const texture_head = PIXI.Texture.from('snake_head.png');
const texture_body = PIXI.Texture.from('snake_body.png');
const texture_apple = PIXI.Texture.from('apple_image.png');
const texture_background = PIXI.Texture.from('tile_aqua.png');


const sprite_body = new PIXI.Sprite(texture_body);
const sprite_head = new PIXI.Sprite(texture_head);
const sprite_apple = new PIXI.Sprite(texture_apple);

sprite_head.anchor.x = 0.5;
sprite_head.anchor.y = 0.5;
sprite_body.anchor.x = 0.5;
sprite_body.anchor.y = 0.5;
sprite_apple.anchor.x = 0.5;
sprite_apple.anchor.y = 0.5;

const tilingSprite = new PIXI.TilingSprite(
    texture_background,
    app.screen.width,
    app.screen.height,
);

container.addChild(tilingSprite);
let x=50; 
let y=50;
let direction = "right"
let apple_x = 250;
let apple_y = 250;
let snake=[]
let length=5;
let game_started = false
let points = 0;
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
function end_game(){

    direction = "right"
    apple_x = 250;
    apple_y = 250;
    length=5;
    game_started = false
    points = 0;
    update_score()
    sprite_head.rotation =  0;
    const explosion = new PIXI.AnimatedSprite(explosionTextures);
    explosion.x = x
    explosion.y = y
    explosion.anchor.set(0.5);
    explosion.scale.set(0.75 + Math.random() * 0.5);
    explosion.loop = false
    explosion.play();
    app.stage.addChild(explosion);
    explosion.onComplete = () => {
        app.stage.removeChild(explosion);
    };

    x=50; 
    y=50;
    if (snake.length >0) {
        for (let body_part of snake) {
            container.removeChild(body_part)
        }
    }
    snake = []
}


function onKeyDown(key) {
    if (key.keyCode === 32) {
     game_started = true
     update_startscreen()
    }
    if (key.keyCode === 87 || key.keyCode === 38) {
        if (y != 0) {
            direction= "up"
        }
    }

    if (key.keyCode === 83 || key.keyCode === 40) {
        if (y != container.height - 5) {
            direction= "down"
        }
    }

    if (key.keyCode === 65 || key.keyCode === 37) {
        if (x != 0) {
            direction= "left"
        }
    }


    if (key.keyCode === 68 || key.keyCode === 39) {
        if (x != container.width - 5) {
            direction= "right"
        }
    }
}
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}


function addToSnake(x,y,snake){
    const tmp = new PIXI.Sprite(texture_body);    
    tmp.anchor.x = 0.5;
    tmp.anchor.y = 0.5;
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
let text_start;

function update_startscreen() {
    if (game_started==false) {
        if (text_start) container.removeChild(text_start)
        text_start = container.addChild(
            new PIXI.Text("Snake By Onni \n Press Space to start", {
            fontSize: 24,
            lineHeight: 28,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
            })
        ); 
        text_start.position.set(150,175)
        
    } else {
        if (text_start) container.removeChild(text_start)
    }
}

app.ticker.add((delta) =>
{    
    if (game_started) {
        sleepFor(speed)
        if (direction=="up" && y>0){
            y= y-step;
            addToSnake(x,y,snake);
            sprite_head.rotation = Math.PI * 2 * 0.0;
        }
        if (direction=="down" && y<490){
            y= y+step;
            addToSnake(x,y,snake);    
            sprite_head.rotation = Math.PI * 2 * 0.5;
        }
            
        if (direction=="left" && x>0){
            x= x-step;
            addToSnake(x,y,snake);
            sprite_head.rotation = Math.PI * 2 * 0.75;
        }
        if (direction=="right" && x<490){
            x= x+step;
            addToSnake(x,y,snake);
            sprite_head.rotation = Math.PI * 2 * 0.25;
        }
        if (y >= 490 || y <= 0 || x >= 490 || x <= 0){
            end_game()
        }

        sprite_head.position.x = x;
        sprite_head.position.y = y;
        const collison = testForAABB(sprite_head, sprite_apple)
        if (collison) {
            sprite_apple.x = getRandomInt(10,490)
            sprite_apple.y = getRandomInt(10,490)
            length = length + 1
            points = points+1
            update_score() 
            update_startscreen()
        }
    } else {
        update_startscreen()
    }

});
app.ticker.speed = .1;
app.start();
