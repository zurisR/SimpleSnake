import React from 'react';
import './score.css';

function Score(props) {
    return (
        <div className="score">
            <span>ОЧКИ:</span>
            <span>{props.value}</span>
        </div>
    );
}

export default Score;