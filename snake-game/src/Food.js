import React, { Component } from 'react';

export default (props) => {
    const style = {
        left: `${props.food.x}%`,
        top: `${props.food.y}%`
    }
    return (
        <div>
            <div className="food" style={style}>
              {/* <h1 className="foodText"> OCP</h1> */}
            </div>
        </div>)
}
