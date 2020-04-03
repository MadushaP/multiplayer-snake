import React, { Component } from 'react';
import Confetti from 'react-dom-confetti';

const config = {
    angle: "360",
    spread: "360",
    startVelocity: "22",
    elementCount: "20",
    dragFriction: "0.05",
    duration: "1350",
    stagger: 0,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

export default (props) => {
    const style = {
        left: `${props.food.x}%`,
        top: `${props.food.y}%`
    }
    return (
        <div>
            <div className="food" style={style}>
            <Confetti active={props.showConfetti}  config={ config } />
                <div className="foodText"> {props.acronym}</div>
            </div>
        </div>)
}
