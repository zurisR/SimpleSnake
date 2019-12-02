import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Game from '../components/Game/Game';
import MainMenu from '../components/mainmenu/MainMenu';
import ScoresTable from '../components/scorestable/ScoresTable';

function Main(props) {
    return (
        <Switch>
            <Route exact path="/SimpleSnake" component={MainMenu} />
            <Route path="/SimpleSnake/game" component={Game} />
            <Route path="/SimpleSnake/scorestable" component={ScoresTable} />
        </Switch>
    );
}

export default Main;