import React from 'react';

export default (props) => {
    return (
        <div>
            <div className="scoreBoard">
                <h1 >Score: {props.score}
                    <button className="ai-button" onClick={() => props.setAi(true)}>AI MODE ENGAGE </button>
                    <div className="ai-status">
                        {props.aiStatus ? <div className="ai-button">  AI ON</div> : <div className="ai-button">AI OFF</div>}
                    </div>
                </h1>
            </div>
        </div>)
}
