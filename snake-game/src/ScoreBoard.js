import React from 'react';
import Toggle from 'react-toggle'
import "react-toggle/style.css"

export default (props) => {

    function setSound() {
        if (props.volume == 1)
          props.setVolume(0)
        else
          props.setVolume(1)
      }

      function setAiStatus() {
        if (props.aiStatus)
          props.setAi(false)
        else
          props.setAi(true)
      }

    return (
        <div className="parent">
            <div className="child">
                <div className="gameBoardText">Score: {props.score}</div>
            </div>
            <div className="child">
                <div className="gameBoardText">{props.fullWord} </div>
            </div>
            <div className="child">
                <div className="settings">
                    <div>AI
                      <Toggle className="spacing" defaultChecked={false} onChange={() => setAiStatus()} />
                    </div>
                    <div className="larger-spacing"></div>
                    <div>Sound
                      <Toggle className="spacing" defaultChecked={true} onChange={() => setSound()} />
                    </div>
                </div>
            </div>
        </div>)
}
