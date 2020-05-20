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

      function seAcronymStatus() {
        console.log(props.acronymStatus)
        if (props.acronymStatus)
          props.setAcronymStatus(false)
        else
          props.setAcronymStatus(true)
      }

    return (
        <div className="parent">
            <div className="child">
                <div className="gameBoardText">Score: {props.score}</div>
            </div>
            <div className="child2">
                <div className="gameBoardText">{props.fullWord} </div>
            </div>
            <div className="child3">
                <div className="settings">
                    <div style={{'width':'37%'}}>AI
                      <Toggle className="spacing"  style={{'padding-top':'37%'}} defaultChecked={false} onChange={() => setAiStatus()} />
                    </div>
                    <div  style={{'width':'60%'}}>Sound
                      <Toggle className="spacing" defaultChecked={true} onChange={() => setSound()} />
                    </div>
                    <div  style={{'width':'71%'}}> Acronym
                      <Toggle className="spacing" defaultChecked={props.acronymsStatus} onChange={() => seAcronymStatus()} />
                    </div>
                </div>
            </div>
        </div>)
}
