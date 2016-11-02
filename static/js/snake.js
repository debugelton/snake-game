'use strict';

function Snake(stage, options) {
    this.ctx         = stage.getContext('2d');
    this.height     = stage.height;
    this.width      = stage.width;
    this.gridUnit   = 20;
    this.gridWidth  = stage.width / this.gridUnit;
    this.gridHeight = stage.height / this.gridUnit;
    this.grid       = [];
    this.direction  = undefined;
    this.snakeGrow  = true;
    this.snake      = [this.getRandomPos()];
    this.goal       = this.getRandomPos();
    this.interval;
    this.options    = options;
    this.speed      = 500;

    let grid = this.grid;
    for (var x=0; x<this.gridUnit; x++) {
        grid[x] = [];
        for (var y=0; y<this.gridUnit; y++) {
            grid[x][y] = {
                'x': x * this.gridWidth,
                'y': y * this.gridHeight,
                'h': this.gridHeight,
                'w': this.gridWidth
            };
        }
    }
    this.grid = grid;
    var that = this;
    window.addEventListener('keydown', function (e) {that.getKeyPress(e) }, false);
};

Snake.prototype.getSnakeHead = function () {
    return {
        'x': this.snake[0].x,
        'y': this.snake[0].y
    };
};

Snake.prototype.getRandomPos = function () {
    return {
        'x': Math.floor((Math.random() * this.gridUnit)), 
        'y': Math.floor((Math.random() * this.gridUnit))
    }
};

Snake.prototype.setInterval = function () {
    let that = this;
    return window.setInterval(function () {that.move()}, this.speed);
};

Snake.prototype.growSnake = function () {

};

Snake.prototype.drawSnake = function () {
    let snake = this.snake;
    let ctx = this.ctx;
    let gridWidth = this.gridWidth;
    let gridHeight = this.gridHeight;
    ctx.fillStyle = 'black';
    snake.forEach(function (root) {
        ctx.fillRect(root.x * gridHeight, root.y * gridWidth, gridWidth, gridHeight);
    });
};

Snake.prototype.drawGoal = function () {
    let goal = this.goal;
    let ctx = this.ctx;
    let gridWidth = this.gridWidth;
    let gridHeight = this.gridHeight;
    ctx.beginPath();
    ctx.arc(goal.x * this.gridWidth + (this.gridWidth/2), goal.y * this.gridHeight + (this.gridHeight/2), this.gridWidth/4, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
};

Snake.prototype.drawGrid = function () {
    return;
    var ctx = this.ctx;
    var grid = this.grid;
    grid.forEach(function (e, x) {
        e.forEach(function (e, y) {
            ctx.strokeRect(e.x, e.y, e.w, e.h);
        });
    });
};


Snake.prototype.outOfArea = function () {
    let snakehead = this.getSnakeHead();
    let collision = false;
    if (snakehead.x < 0 || snakehead.y < 0) {
        collision = true; // out of area
    }
    if (snakehead.x >= this.gridUnit || snakehead.y >= this.gridUnit) {
        collision = true; // out of area
    }
    if (collision) {
        if (this.options.onOutOfArea) this.options.onOutOfArea();
    }
    return collision;
};


Snake.prototype.selfDestruction = function () {
    let snakehead = this.getSnakeHead();
    let snake     = this.snake.slice(1);
    let collision = false;
    if (snake.length === 0) return;
    // self destruction
    snake.forEach(function(e) {
        if (e.x === snakehead.x && e.y === snakehead.y) {
            collision = true;
        }
    });
    if (collision) {
        if (this.options.onPaint) this.options.onSelfDestruction();
    }
    return collision;
};

Snake.prototype.gotGoal = function (x, y) {
    if (x === this.goal.x && y === this.goal.y) return true; // goal
    return false;
};

Snake.prototype.getKeyPress = function (e) {
    var keys = [37, 38, 39, 40];
    if (keys.indexOf(e.keyCode) < 0) return;
    switch (e.keyCode) {
        case 38: 
            this.direction = "up";
            break;
        case 40: 
            this.direction = "down";
            break;
        case 37: 
            this.direction = "left";
            break;
        case 39:
            this.direction = "right";
            break;
    }
};


Snake.prototype.move = function () {
    var snake = this.snake;
    var direction = this.direction;
    var snakehead = this.getSnakeHead();
    if (direction === "up") {
        snakehead.y--
    }
    if (direction === "down") {
        snakehead.y++
    }
    if (direction === "left") {
        snakehead.x--;
    }
    if (direction === "right") {
        snakehead.x++;
    }
    if (this.outOfArea()) {
        clearInterval(this.interval);
        return;
    }
    if (this.selfDestruction()) {
        clearInterval(this.interval);
        return;
    }
    if (this.gotGoal(snakehead.x, snakehead.y)) {
        this.goal = this.getRandomPos();
        snake.unshift(
            JSON.parse(JSON.stringify(snake[0]))
        ); // grow snake
        clearInterval(this.interval);
        this.speed = this.speed-10;
        this.interval = this.setInterval();
        this.drawGoal()
    }
    snake.unshift(snakehead);
    snake.pop();
    this.paint();
    if (this.options.onMove) this.options.onMove();
};

Snake.prototype.paint = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawGrid();
    this.drawSnake();
    this.drawGoal();
    if (this.options.onPaint) this.options.onPaint();
};

Snake.prototype.start = function () {
    this.interval = this.setInterval();
    if (this.options.onStart) this.options.onStart();
};

let canvas = document.getElementById('snake');
let s = new Snake(canvas, {
    onCollision: function () { console.log("collision!!!"); },
    onOutOfArea: function () {console.log("out of area!!!!"); },
    onSelfDestruction: function () { console.log("self destruction!!!!"); },
    onStart: function () { console.log("hello World"); },
    onPaint: function () { console.log("painting...."); },
    onMove: function () { console.log("moving...."); }
});
s.direction = "up";
s.start();

