import React from 'react';
import MainMenuItem from './MainMenuItem';
import './mainmenu.css';

function MainMenu(props) {
    return (
        <div className="wrapper">
            <h2>Змейка</h2>
            <ul>
                <MainMenuItem link="/SimpleSnake/game" text="Игра"/>
                <MainMenuItem link="/SimpleSnake/scorestable" text="Таблица результатов" />
            </ul>
        </div>
    );
}

export default MainMenu;