'use strict';

function Snake(stage) {
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
};

Snake.prototype.getRandomPos = function () {
    return {
        'x': Math.floor((Math.random() * this.gridUnit)), 
        'y': Math.floor((Math.random() * this.gridUnit))
    }
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

Snake.prototype.setInterval = function () {
    let that = this;
    return window.setInterval(function () {that.move()}, 500);
};

Snake.prototype.start = function () {
    this.interval = this.setInterval();
};

Snake.prototype.growSnake = function () {
    let snake = JSON.parse(JSON.stringify(this.snake));
    let direction = this.direction;
    let first = snake.shift(0);
    let last = snake.slice(-1).pop();
    switch (direction) {
        case "up":

        break
    }
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

Snake.prototype.move = function () {
    var snake = JSON.parse(JSON.stringify(this.snake));
    var direction = this.direction;
    var first = JSON.parse(JSON.stringify(snake[0]));

    if (direction === "up") {
        first.y--
    }
    if (direction === "down") {
        first.y++
    }
    if (direction === "left") {
        first.x--;
    }
    if (direction === "right") {
        first.x++;
    }
    if (this.outOfArea(first.x, first.y)) {
        return;
    }
    if (this.selfDestruction(first.x, first.y)) {
        return;
    }
    if (this.gotGoal(first.x, first.y)) {
        this.goal = this.getRandomPos();
        snake.unshift(
            JSON.parse(JSON.stringify(snake[0]))
        ); // grow snake
        this.drawGoal()
    }
    snake.unshift(first);
    snake.pop();
    this.snake = snake;
    this.paint();
};

Snake.prototype.outOfArea = function (x, y) {
    if (x < 0 || y < 0) return true; // out of area
    if (x >= this.gridUnit || y >= this.gridUnit) return true; // out of area
    return false;
};
Snake.prototype.selfDestruction = function (x, y) {
    let snake = this.snake;
    let collision = false;
    // self destruction
    snake.forEach(function(e) {
        if (e.x === x && e.y === y) {
            collision = true;
        }
    });
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

Snake.prototype.paint = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawGrid();
    this.drawSnake();
    this.drawGoal();
};
let canvas = document.getElementById('snake');
let s = new Snake(canvas);
s.direction = "up";
s.start();

window.addEventListener('keydown', function (e) {s.getKeyPress(e)}, false);