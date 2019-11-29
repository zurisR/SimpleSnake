import React, {useState, useEffect, useRef} from 'react';
import Button from '../button/Button';
import Score from '../score/Score';
import './game.css';

import Snake from '../../engine/Snake';


function Game(props) { 
    
    //false - ended, true - in process
    const [gameStatus, setGameStatus] = useState(true);
    const [score, setScore] = useState(0);
    
    const canvas = useRef(null);

    const snake = new Snake(2, 0, 225);

    useEffect(() => {
        let ready = snake.getReadyStatus();
        if (!ready) {
            let ctx = canvas.current.getContext("2d");
            snake.setContext(ctx);
            snake.setWidthLimit(canvas.current.width);
            snake.setHeightLimit(canvas.current.height);
            snake.setScoreSetter(setScore);
            snake.setReadyStatus(true);
        }
    });

    function startGame(e) {
        e.preventDefault();

        snake.startGame(setGameStatus);
    }

    return (
        <div className="wrapper">
            <Score value={score} />
            <canvas ref={canvas} id="gamespace" width="500" height="500">
                Похоже, что вы используете очень старый браузер. Вы многое теряете...
            </canvas> 
            <div>
                <Button onClick={startGame} text="Start"/>          
            </div>
        </div>
    );
}

export default Game;