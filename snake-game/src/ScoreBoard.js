import React from 'react';
import Toggle from 'react-toggle'
import "react-toggle/style.css"

export default (props) => {
    return (
        <div className="parent">
            <div className="child">
                <div className="gameBoardText">Score: {props.score}</div>
            </div>
            <div className="child">
                <div className="gameBoardText">Word [placeholder] </div>
            </div>
            <div className="child">
                <div className="ai-status">
                    {props.aiStatus ? <div className="ai-button">  AI ON</div> : <div className="ai-button">AI OFF</div>}
                    <div className='ai-switch'>
                        <Toggle 
                            defaultChecked={false}
                            onChange={() => props.setAi(true)} />
                    </div>
                </div>
            </div>
        </div>)
}
