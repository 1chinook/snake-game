"use strict";

const board = document.getElementById("main-board");
const context = board.getContext("2d");
const scoreText = document.getElementById("score");
const resetButton = document.getElementById("reset-button");
const cellSize = 25;
const directions = new Map([
    ["ArrowLeft", { x: -cellSize, y: 0 }],
    ["ArrowUp", { x: 0, y: -cellSize }],
    ["ArrowRight", { x: cellSize, y: 0 }],
    ["ArrowDown", { x: 0, y: cellSize }],
]);
let timer;
let snake;
let food;
let direction;
let nextDirection;
let score;

function sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
}

function chooseFood() {
    const available = [];
    for (let y = 0; y < board.height; y += cellSize) {
        for (let x = 0; x < board.width; x += cellSize) {
            const cell = { x, y };
            if (!snake.some((segment) => sameCell(segment, cell))) available.push(cell);
        }
    }
    return available[Math.floor(Math.random() * available.length)];
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    if (food) {
        context.fillStyle = "red";
        context.fillRect(food.x, food.y, cellSize, cellSize);
    }
    context.fillStyle = "green";
    context.strokeStyle = "black";
    for (const segment of snake) {
        context.fillRect(segment.x, segment.y, cellSize, cellSize);
        context.strokeRect(segment.x, segment.y, cellSize, cellSize);
    }
}

function finish(message) {
    context.font = "50px MV Boli";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(message, board.width / 2, board.height / 2);
}

function tick() {
    if (nextDirection) direction = nextDirection;
    nextDirection = undefined;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const eating = sameCell(head, food);
    const body = eating ? snake : snake.slice(0, -1);
    if (
        head.x < 0 || head.x >= board.width || head.y < 0 || head.y >= board.height ||
        body.some((segment) => sameCell(head, segment))
    ) {
        finish("Game Over!");
        return;
    }

    snake.unshift(head);
    if (eating) {
        scoreText.textContent = ++score;
        food = chooseFood();
    } else {
        snake.pop();
    }

    draw();
    if (food) timer = setTimeout(tick, 75);
    else finish("You Win!");
}

function reset() {
    clearTimeout(timer);
    score = 0;
    scoreText.textContent = score;
    direction = directions.get("ArrowRight");
    nextDirection = undefined;
    snake = Array.from({ length: 5 }, (_, index) => ({ x: (4 - index) * cellSize, y: 0 }));
    food = chooseFood();
    draw();
    timer = setTimeout(tick, 75);
}

window.addEventListener("keydown", (event) => {
    const requested = directions.get(event.key);
    if (!requested) return;
    event.preventDefault();
    if (requested === direction || nextDirection) return;
    if (requested.x === -direction.x && requested.y === -direction.y) return;
    nextDirection = requested;
});

resetButton.addEventListener("click", reset);
reset();
