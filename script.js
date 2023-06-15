const cnv = document.querySelector('canvas');
const ctx = cnv.getContext('2d');

cnv.width = window.innerWidth - 50;
cnv.height = window.innerHeight - 50;

const gravity = 0.05;
let frameCount = 0;
let input = {};
let platforms = [];

document.addEventListener('keydown', (e) => {
  input[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  input[e.key] = false;
});

let camera = {
  x: 0,
  y: 0,
};

let player = {
  x: 50,
  y: 400,
  w: 50,
  h: 50,
  vx: 0,
  vy: 0,
  yThrust: 0.1,
  xThrust: 0.05,
  state: 'falling',
  speed: 0,
  targetX: 0,

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.w, this.h);
  },

  move() {
    if (this.state === 'falling') {
      this.vy += gravity;
    } else if (this.state === 'sliding' && (this.targetX - (this.x + this.vx + this.w / 2)) / this.vx < 0) {
      this.state = 'standing';
      this.x = this.targetX - this.w / 2;
      this.vx = 0;
    }

    if (input.a && this.state != 'sliding') {
      this.vy -= this.yThrust;
      this.vx += this.xThrust;

      if (this.state === 'standing') {
        this.vy = -5;
        this.vx = 1;
        this.state = 'falling';
      }
    }

    if (input.d && this.state != 'sliding') {
      this.vy -= this.yThrust;
      this.vx -= this.xThrust;

      if (this.state === 'standing') {
        this.vy = -5;
        this.vx = 1;
        this.state = 'falling';
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
  },

  checkCollision() {
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      if (
        this.x + this.w > platform.x &&
        this.x < platform.x + platform.w &&
        this.y + this.h > platform.y &&
        this.y < platform.y + platform.h
      ) {
        if (this.y + this.h - this.vy < platform.y) {
          this.slide(platform);
        } else {
          if (this.vx > 0) {
            this.x = platform.x - this.w;
            this.vx = 0;
          } else {
            this.x = platform.x + platform.w;
            this.vx = 0;
          }
        }
      }
    }
  },

  slide(platform) {
    this.state = 'sliding';
    this.y = platform.y - this.h;
    this.vy = 0;
    this.targetX = platform.x + platform.w / 2;
    this.vx = 5 * Math.sign(this.targetX - (this.x + this.w / 2));
  },
};

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 10;

    platforms.push(this);
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.w, this.h);
  }
}

new Platform(50, 500);
new Platform(400, 100);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  player.move();
  player.checkCollision();
  player.draw();

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    platform.draw();
  }

  //   camera.x++;

  frameCount++;
}

animate();
