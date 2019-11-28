import SnakePart from './SnakePart';
import {Directions} from './enums';

class Snake {
    constructor(length, x, y) {
        this.snake = [];
        this.snakeHead = null;
        this.xCordStart = x;
        this.yCordStart = y;

        this.speed = 100;
        this.SNAKE_PART_SIZE = 25;
        this.currentDirection = Directions.ArrowRight;

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
        this.stopGame = this.stopGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.isPlayerLost = this.isPlayerLost.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.initSnake(length);
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

    drawSnake() {
        if (this.snake.length === 0) {
            console.log("The Snake hasn't been initialize.");
            return;
        }    
        
        if (!this.gameIsEnded && this.isPlayerLost()) {
            this.stopGame();
        }

        let prevPart = null;

        let stepDest = this.SNAKE_PART_SIZE;

        let movingDirection = this.currentDirection;

        this.snake.forEach(part => {
            console.log(part === this.snakeHead, part.getCurrentCords());
            part.draw(this.ctx);

            if (part === this.snakeHead) {
                let [xCord, yCord] = part.getCurrentCords();

                switch (movingDirection) {
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

                // if (xCord + stepDest === this.wLimit) {
                //     // // xCord = 0;
                //     // this.stopGame();
                // } else {
                //     xCord += stepDest;
                // }
                part.setCurrentCords(xCord, yCord);
            }

            if (prevPart) {
                let [xCord, yCord] = prevPart.getPrevCords();
                part.setCurrentCords(xCord, yCord);
            }
            
            prevPart = part;
        });

        
    }

    startGame(callback) {
        this.notifyAboutGameStatus = callback;

        this.gameIsEnded = false;
        this.rafID = requestAnimationFrame(this.loop);

        this.notifyAboutGameStatus(true);

        document.onkeydown = this.onKeyDown;
    }

    stopGame() {
        document.onkeydown = null;
        this.gameIsEnded = true;
        this.notifyAboutGameStatus(false);
        cancelAnimationFrame(this.rafID);

    }

    loop(timestamp) {
        if (this.gameIsEnded) {
            return;
        }
        if (!this.lastTimeRedrawing) {
            this.lastTimeRedrawing = timestamp;
        }

        let timeDifference = timestamp - this.lastTimeRedrawing;

        if (!this.ctx) {
            return;
        }

        if (timeDifference >= this.speed) {
            this.ctx.clearRect(0, 0, this.wLimit, this.hLimit);
            this.drawSnake();
            this.lastTimeRedrawing = timestamp;
        }
        
        this.rafID = requestAnimationFrame(this.loop);
    }

    isPlayerLost() {
        let loser = false;
        let movingIndex = 1,
            movingDirection = this.currentDirection,
            step = this.SNAKE_PART_SIZE;
        let [xCord, yCord] = this.snakeHead.getCurrentCords();
        //check on borders
        switch (movingDirection) {
            case Directions.ArrowRight:
                xCord += step; 
                if (xCord === this.wLimit) {
                    loser = true;
                }
                break;
            case Directions.ArrowLeft:
                if (xCord === 0) {
                    loser = true;
                }
                break;
            case Directions.ArrowUp:
                if (yCord === 0) {
                    loser = true;
                }
                break;
            case Directions.ArrowDown:
                yCord += step;
                if (yCord === this.hLimit) {
                    loser = true;
                }
                break;
            default:
                break;
        }

        return loser;
    }

    onKeyDown(e) {
        //ban the opposite directions
        if (this.currentDirection === Directions[e.code] * -1) {
            return;
        }
        this.currentDirection = Directions[e.code];
    }
}

export default Snake;