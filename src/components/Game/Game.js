import React, {useState, useEffect, useRef} from 'react';
import Button from '../button/Button';
import Score from '../score/Score';
import './game.css';

import Snake from '../../engine/Snake';

function Game(props) { 
    
    const [scores, setScore] = useState(0);
    const [gameIsOver, setGameIsOver] = useState(false);
    
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
            snake.setGameIsOverSetter(setGameIsOver);
            snake.setReadyStatus(true);
        }
    });

    useEffect(() => {
        if (gameIsOver) {
            storeScores();
        }
    }, [gameIsOver]);

    function storeScores() {
        let name = prompt('Введите имя для сохранения результата.');
        if (name) {
            let prevRecord = localStorage.getItem(name);
            if (prevRecord && Number(prevRecord) > scores) {
                console.log("Your previous scores record bigger than current.");
                return;
            }
            localStorage.setItem(name, scores);
        }
    }

    function startGame(e) {
        e.preventDefault();
        setGameIsOver(false);
        snake.startGame();
    }

    return (
        <div className="wrapper">
            <Score value={scores} />
            <canvas ref={canvas} id="gamespace" width="500" height="500">
                Похоже, что вы используете очень старый браузер. Вы многое теряете...
            </canvas>
            <Button onClick={startGame} text="Начать"/>
        </div>
    );
}

export default Game;