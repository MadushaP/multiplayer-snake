import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 


export default (props) => {
    return (
    
          <ReactCSSTransitionGroup
          transitionName="animation"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}> 
            {props.snake.map((dot, i) => {
                const style = {
                    left:`${dot[0]}%`,
                    top:`${dot[1]}%`
                }
                return <div key={[dot[0], dot[1]]} className="snake-dot" style={style}></div>
            })}
            </ReactCSSTransitionGroup>);
}

