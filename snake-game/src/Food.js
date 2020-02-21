import React, { Component } from 'react';

export default (props) => {
    const style = {
        left: `${10}%`,
        top: `${10}%`
    }
    return (
        <div>
            <div  className="food" style={style}></div>
        </div>)
}
