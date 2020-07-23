import React from 'react'
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default (props) => {

  const setSound = () => {
    if (props.volume === 1)
      props.setVolume(0)
    else
      props.setVolume(1)
  }

  const setAiStatus = () => {
    let currentSnake = props.playerSnakeArray.find(x => x.playerId == props.playerId)
    if (currentSnake.aiStatus) {
      props.updateFieldChange(props.playerId, 'aiStatus', false)
    }
    else {
      props.updateFieldChange(props.playerId, 'aiStatus', true)
    }
  }

  const seAcronymStatus = () => {
    if (props.acronymStatus)
      props.setAcronymStatus(false)
    else
      props.setAcronymStatus(true)
  }

  let AIOption = (props.gameMode === "singlePlayer") ?
    <div style={{ 'width': '37%' }}>AI
      <Toggle className="spacing" style={{ 'paddingTop': '37%' }} defaultChecked={false} onChange={() => setAiStatus()} />
    </div> :
    null

  return (
    <div className="parent">
      <div className="child">
        <div className="scoreText">
          Score:
        <ReactCSSTransitionGroup
            transitionName="score"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1}>
            <div key={props.score} style={{ 'display': 'inline-block', 'paddingLeft': '5px' }}>
              {props.score}
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
      <div className="child" style={{ 'width': '500px' }}>
        <div className="fullWordText">{(props.gameMode === "singlePlayer") ? props.fullWord : 'Multiplayer'} </div>
      </div>
      <div className="settingContainer">
        <div className="settings">
          {AIOption}
          <div style={{ 'width': '60%' }}>Sound
            <Toggle className="spacing" defaultChecked={true} onChange={() => setSound()} />
          </div>
          <div style={{ 'width': '71%' }}> Acronym
            <Toggle className="spacing" defaultChecked={props.acronymsStatus} onChange={() => seAcronymStatus()} />
          </div>
        </div>
      </div>
    </div>)
}