import React from 'react';
import './scorestable.css';

function TableRow(props) {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.scores}</td>
        </tr>
    );
}

function TableHeader(props) {
    return (
        <tr>
            <th>
                Имя пользователя
            </th>
            <th>
                Набранные очки
            </th>
        </tr>
    );
}

function ScoresTable(props) {

    let content = [];

    let data = [];

    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        data.push({
            key: key,
            value: localStorage.getItem(key),
        });
    }

    data.sort(function(a, b) {
        let aValue = Number(a.value);
        let bValue = Number(b.value);
        if (aValue > bValue) {
            return -1;
        } else if (aValue < bValue) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach(item => {
        content.push(<TableRow name={item.key} scores={item.value} key={item.key}/>);
    });
    
    return (
        <div className="wrapper">
            <table>
                <caption>Таблица рекордов</caption>
                <tbody>
                    <TableHeader />
                    {content}
                </tbody>
            </table>
        </div>
    );
}


export default ScoresTable;