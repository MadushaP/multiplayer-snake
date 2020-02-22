import React from 'react';

export default (props) => {
    return (
        <div>
            <div className="scoreBoard">
            <h1 >Score: {props.score} 
            <button className="ai" onClick={props.setAi}>AI MODE ENGAGE</button> 
            </h1>
            </div>
        </div>)
}
