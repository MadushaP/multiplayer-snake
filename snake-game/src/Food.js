import React, { Component } from 'react';

export default (props) => {
    const style = {
        left: `${props.food.x}%`,
        top: `${props.food.y}%`
    }
    return (
        <div>
            <div className="food" style={style}>
                <div className="foodText"> {props.acronym}</div>
            </div>
        </div>)
}
