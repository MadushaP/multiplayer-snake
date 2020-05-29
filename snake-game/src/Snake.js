import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function rotateHead(cell, direction, style) {
    switch (direction) {
        case "right":
            style.top = `${cell.y - 1}%`;
            style['transform'] = 'rotate(270deg)';
            break;
        case "left":
            style.left = `${cell.x - 0.5}%`;
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
        default:
            break;
    }
}

export default (props) => {
    return (
        <ReactCSSTransitionGroup
            transitionName="animation"
            transitionEnterTimeout={props.speed}
            transitionLeaveTimeout={props.speed}>
            {props.snake.map((cell, i) => {
                const style = {
                    left: `${cell.x}%`,
                    top: `${cell.y}%`
                }

                if (props.snake.length - 1 == i) {
                    let snakeHeadImage = props.colour ? `snake-head-${props.colour}.png`: 'snake-head.png'
                    if (props.isGameOver) {
                        snakeHeadImage = 'snake-head-dead.png'
                    }
                    else {
                        rotateHead(cell, props.direction, style)
                    }
                    if (props.closeToFood) {
                        snakeHeadImage =  props.colour ? `snake-head-eat-${props.colour}.png`: 'snake-head-eat.pngg'
                    }
                    return <img key="head" className="snake-head" src={snakeHeadImage} style={style} ></img>
                }
                else {
                      style.background = '#'+props.colour
                    return <div key={[cell.x, cell.y]} className="snake-body" style={style}></div>
                }
            })}
        </ReactCSSTransitionGroup>);
}

