import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


function rotateHead(cell, direction, style) {
    switch (direction) {
        case "right":
            style.top = `${cell.y - 1}%`;
            style['transform'] = 'rotate(270deg)';
            break;
        case "left":
            style.top = `${cell.y - 1}%`;
            style['transform'] = 'rotate(90deg)';
            break;
        case "down":
            style.left = `${cell.x - 0.3}%`;
            style.top = `${cell.y - 1}%`;
            break;
        case "up":
            style.left = `${cell.x - 0.3}%`;
            style.top = `${cell.y - 1}%`;
            style['transform'] = 'rotate(180deg)';
            break;
    }
    
}
export default (props) => {
    return (

        <ReactCSSTransitionGroup
            transitionName="animation"
            transitionEnterTimeout={150}
            transitionLeaveTimeout={150}>
            {props.snake.map((cell, i) => {
                const style = {
                    left: `${cell.x}%`,
                    top: `${cell.y}%`
                }
    
                if (props.snake.length - 1 == i) {
                    rotateHead(cell, props.direction, style)
                    return <img key="head" className="snake-head" src='snake-head.png' style={style} ></img>
                }
                else {
                    return <div key={[cell.x, cell.y]} className="snake-dot" style={style}></div>
                }
            })}
        </ReactCSSTransitionGroup>);
}

