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
                <div className="settings">
                    <div>AI 
                      <Toggle className="spacing" defaultChecked={false} onChange={() => props.setAi(true)} />
                    </div>
                    <div className="larger-spacing"></div>
                    <div>Sound
                      <Toggle className="spacing" defaultChecked={true} onChange={() => props.setSound()} />
                    </div>
                </div>
            </div>
        </div>)
}
