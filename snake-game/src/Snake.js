import React, {Component} from 'react';
import './App.css';


export default (props) => {
    return (
        <div>
            {props.snake.map((dot, i) => {
                const style = {
                    left:`${dot[0]}%`,
                    top:`${dot[1]}%`
                }
                return <div key={i} className="snake-dot" style={style}></div>
            })}
        </div>);
}

