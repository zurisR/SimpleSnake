import SnakePart from './SnakePart';
import Apple from './Apple';
import {Directions} from './enums';

class Snake {
    constructor(length, x, y) {
        this.snake = [];
        this.snakeHead = null;
        this.apple = null;
        this.xCordStart = x;
        this.yCordStart = y;

        this.points = 0;

        this.AWARD_FOR_APPLE = 5;
        this.SPEED_INCREASING_INDEX = 5;
        this.speed = 300;
        this.SNAKE_PART_SIZE = 25;
        this.currentDirection = Directions.ArrowRight;
        this.nextDirection = Directions.ArrowRight;

        this.lastTimeRedrawing = null;

        this.ready = false;
        this.rafID = null;
        this.gameIsEnded = true;

        this.initSnake = this.initSnake.bind(this);
        this.loop = this.loop.bind(this);
        this.setContext = this.setContext.bind(this);
        this.setWidthLimit = this.setWidthLimit.bind(this);
        this.setHeightLimit = this.setHeightLimit.bind(this);
        this.setReadyStatus = this.setReadyStatus.bind(this);
        this.getReadyStatus = this.getReadyStatus.bind(this);
        this.drawSnake = this.drawSnake.bind(this);
        this.drawEndGame = this.drawEndGame.bind(this);
        this.stopGame = this.stopGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.isPlayerLost = this.isPlayerLost.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.initSnake(length);

        this.img = new Image(400, 400);
        this.img.src = '/wasted.png';
    }

    setGameIsOverSetter(callback) {
        this.setGameIsOver = callback;
    }

    setScoreSetter(callback) {
        this.setScoreToUI = callback;
    }
    
    setContext(ctx) {
        this.ctx = ctx;
    }

    setWidthLimit(limit) {
        this.wLimit = limit;
    }

    setHeightLimit(limit) {
        this.hLimit = limit;
    }

    setReadyStatus(status) {
        this.ready = status;
    }

    getReadyStatus() {
        return this.ready;
    }

    initSnake(length = 3) {
        for (let i = 0; i < length; i++) {
            let isHead = i === 0;
            let xCordNext = this.xCordStart;
            if (!isHead) {
                xCordNext = this.xCordStart - (i * this.SNAKE_PART_SIZE);
            }
            let snakePart = new SnakePart(xCordNext, this.yCordStart, this.SNAKE_PART_SIZE, isHead);

            if (isHead) {
                this.snakeHead = snakePart;
            }

            this.snake.push(snakePart);
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    checkForCrossWithSnake(xCord, yCord, excludeHead = false) {
        let result = true;

        for (let part of this.snake) {
            if (excludeHead && this.snakeHead === part) {
                continue;
            }
            let [xCordSnakePart, yCordSnakePart] = part.getCurrentCords();
            if (xCord === xCordSnakePart && yCord === yCordSnakePart) {
                result = false;
            }
        }

        return result;
    }

    drawApple() {
        if (!this.apple) {
            let xCord, yCord;
            while (true) {
                xCord = this.getRandomInt(20) * 25;
                yCord = this.getRandomInt(20) * 25;

                if (this.checkForCrossWithSnake(xCord, yCord)) {
                    break;
                }
            }
            this.apple = new Apple(xCord, yCord, 25);
        }

        this.apple.draw(this.ctx);
    }

    drawSnake() {
        if (this.snake.length === 0) {
            console.log("The Snake hasn't been initialize.");
            return;
        }     

        let prevPart = null;

        let stepDest = this.SNAKE_PART_SIZE;
        
        this.snake.forEach(part => {
            part.draw(this.ctx);

            if (part === this.snakeHead) {
                let [xCord, yCord] = part.getCurrentCords();
                let [xCordApple, yCordApple] = this.apple.getCoords();

                if (xCord === xCordApple && yCord === yCordApple) {
                    //eat this apple ;)
                    this.points += this.AWARD_FOR_APPLE;
                    this.speed -= this.speed <= 100 ? 0 : this.SPEED_INCREASING_INDEX;
                    this.apple = null;
                    this.addPartToSnake();
                    this.setScoreToUI(this.points);
                }

                switch (this.currentDirection) {
                    case Directions.ArrowRight:
                        xCord += stepDest; 
                        break;
                    case Directions.ArrowLeft:
                        xCord -= stepDest;
                        break;
                    case Directions.ArrowUp: 
                        yCord -= stepDest;
                        break;
                    case Directions.ArrowDown:
                        yCord += stepDest;
                        break;
                    default:
                        break;
                }

                part.setCurrentCords(xCord, yCord);
            }

            if (prevPart) {
                let [xCord, yCord] = prevPart.getPrevCords();
                part.setCurrentCords(xCord, yCord);
            }
            
            prevPart = part;
        });
        if (!this.gameIsEnded && this.isPlayerLost()) {
            this.stopGame();
        }
    }

    drawEndGame() {        
        this.ctx.clearRect(0, 0, this.wLimit, this.hLimit);
        this.ctx.drawImage(this.img, 0, 0, 500, 500);
    }

    addPartToSnake() {
        let [xCord, yCord] = this.snake[this.snake.length - 1].getCurrentCords();
        let snakePart = new SnakePart(xCord, yCord, this.SNAKE_PART_SIZE);
        this.snake.push(snakePart);
    }

    startGame() {
        document.onkeydown = this.onKeyDown;

        this.gameIsEnded = false;
        this.points = 0;
        this.rafID = requestAnimationFrame(this.loop);

        this.setScoreToUI(0);

    }

    stopGame() {
        document.onkeydown = null;
        this.gameIsEnded = true;

        this.setGameIsOver(true);
    }

    loop(timestamp) {
        if (this.gameIsEnded) {
            this.drawEndGame();
            return;
        }
        if (!this.lastTimeRedrawing) {
            this.lastTimeRedrawing = timestamp;
        }

        let timeDifference = timestamp - this.lastTimeRedrawing;

        if (timeDifference >= this.speed) {
            this.currentDirection = this.nextDirection;
            this.ctx.clearRect(0, 0, this.wLimit, this.hLimit);
            this.drawApple();
            this.drawSnake();
            this.lastTimeRedrawing = timestamp;
        }
        
        this.rafID = requestAnimationFrame(this.loop);
    }

    isPlayerLost() {
        let playerLost = false;
        let movingDirection = this.currentDirection,
            step = this.SNAKE_PART_SIZE;
        let [xCord, yCord] = this.snakeHead.getCurrentCords();
        //check on borders
        switch (movingDirection) {
            case Directions.ArrowRight:
                xCord += step; 
                if (xCord > this.wLimit) {
                    playerLost = true;
                } 
                break;
            case Directions.ArrowLeft:
                
                if (xCord < 0) {
                    playerLost = true;
                }
                break;
            case Directions.ArrowUp:
                // yCord += step;
                if (yCord < 0) {
                    playerLost = true;
                }
                break;
            case Directions.ArrowDown:
                yCord += step;
                if (yCord > this.hLimit) {
                    playerLost = true;
                }
                break;
            default:
                break;
        }

        if (!this.checkForCrossWithSnake(xCord, yCord, true)) {
            playerLost = true;
        }

        return playerLost;
    }

    onKeyDown(e) {
        this.nextDirection = Directions[e.code];

        if (this.nextDirection === undefined) {
            this.nextDirection = this.currentDirection;
        }

        //ban the opposite directions
        if (this.currentDirection === this.nextDirection * -1) {
            this.nextDirection = this.currentDirection;
        }
    }
}

export default Snake;