import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default (props) => {
    return (

        <ReactCSSTransitionGroup
            transitionName="animation"
            transitionEnterTimeout={100}
            transitionLeaveTimeout={100}>
            {props.snake.map((cell, i) => {
                const style = {
                    left: `${cell.x}%`,
                    top: `${cell.y}%`
                }
                if (props.snake.length - 1 == i) {
                    return <div key={[cell.x, cell.y]} className="snake-head" style={style}></div>
                }
                else {
                    return <div key={[cell.x, cell.y]} className="snake-dot" style={style}></div>
                }
            })}
        </ReactCSSTransitionGroup>);
}

