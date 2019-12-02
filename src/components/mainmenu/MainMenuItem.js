import React from 'react';
import {Link} from 'react-router-dom';

function MainMenuItem(props) {
    return (
        <li>
            <Link to={props.link}>
                {props.text}
            </Link>
        </li>
    );
}

export default MainMenuItem;