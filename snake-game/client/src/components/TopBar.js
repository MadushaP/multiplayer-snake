import React from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Sound from '../lib/Sound'
import '../css/playPause.css'

export default (props) => {
  const toggleSound = () => {
      Sound.muteSwitch()
  };

  const togglePause = () => {
    if (props.pause)
      props.setPause(false)
    else
      props.setPause(true)
  };

  const setAiStatus = () => {
    let currentSnake = props.playerSnakeArray.find(
      (x) => x.playerId == props.playerId
    )

    if (!currentSnake.aiStatus) {
      props.setAiUsedFlag(true)
      props.updateFieldChange(props.playerId, "aiStatus", true);
    } else {
      props.updateFieldChange(props.playerId, "aiStatus", false);
    }
  }

  const seAcronymStatus = () => {
    if (props.acronymStatus) props.setAcronymStatus(false);
    else props.setAcronymStatus(true);
  }

  const AIOption =
    <div title="ai" style={{ width: "37%" }}>
      AI
      <Toggle
        className="spacing"
        style={{ paddingTop: "37%" }}
        defaultChecked={false}
        onChange={() => setAiStatus()}
      />
    </div>

  const SoundOption = (
    <div style={{ width: "60%" }}>
      Sound
      <Toggle
        className="spacing"
        defaultChecked={!Sound.getMuteStatus()}
        onChange={() => toggleSound()}
      />
    </div>
  );


  const PauseOption =
    <div title="pause" style={{ width: "20%", paddingTop: "1px" }}>
      <div className="wrapper" onClick={() => togglePause()}>
        <div className={props.pause ? "play" : "pause"}></div>
      </div>
      <div className={props.pause ? "pauseText pulsate" : "pauseText hide"}>
        PAUSED
      </div>
    </div>


  const AcronymOption =
    <div title="acronym" style={{ width: "71%" }}>
      Acronym
      <Toggle
        className="spacing"
        defaultChecked={props.acronymsStatus}
        onChange={() => seAcronymStatus()}
      />
    </div>

  const singlePlayerOptions =
    <div className="parent">
      <div className="child">
        <div className="scoreText">
          <ReactCSSTransitionGroup
            transitionName="score"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1}>
            <div
              key={props.playerSnakeArray[0] ? props.playerSnakeArray[0].score : null}
              style={{ display: "inline-block", paddingLeft: "5px" }}>
              Score: {props.playerSnakeArray[0] ? props.playerSnakeArray[0].score : null}
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
      <div className="child" style={{ width: "500px" }}>
        <div className="fullWordText">
         {props.acronymStatus ? props.fullWord : <div className="scoreText"> Single Player</div>} 
        </div>
      </div>
      <div className="settingContainer">
        <div className="settings">
          {PauseOption}
          {AIOption}
          {SoundOption}
          {AcronymOption}
        </div>
      </div>
    </div>

  const multiplayerOptions =
    <div className="parent">
      <div className="child" style={{ 'width': '18%' }}>
        <div className="scoreText">
          Multiplayer
        </div>
      </div>
      {props.playerSnakeArray.map((snake, index) => (
        <div key={index} className="child" style={{ backgroundColor: '#' + snake.colour, 'width': '10%' }}>
          <div className="scoreText">

            <ReactCSSTransitionGroup
              transitionName="score"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1}>
              <div
                key={snake.score}
                style={{ display: "inline-block" }}>
                P{index + 1}: {snake.score}
              </div>

            </ReactCSSTransitionGroup>
          </div>
        </div>
      ))}
      {(() => {
        if (props.playerSnakeArray.length <= 1) {
          return (
            <div className="child" style={{ backgroundColor: 'rgb(185 185 185 / 0.13)', 'width': '45%' }}>
              <div className="scoreText">
                <div
                  style={{ display: "inline-block" }}>
                  Waiting for Players to join
               </div>
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
              </div>
            </div>)
        }
      })()}
    </div>



  const vsCpuOptions =
    <div className="parent">
      <div className="child" style={{ 'width': '18%' }}>
        <div className="scoreText">
          vsCPU
       </div>
      </div>
      {props.playerSnakeArray.map((snake, index) => (
        <div key={index} className="child" style={{ backgroundColor: '#' + snake.colour, 'width': '25%' }}>
          <div className="scoreText">

            <ReactCSSTransitionGroup
              transitionName="score"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1}>
              {(() => {
                if (snake.playerId == 0) {
                  return <div
                    key={snake.score}
                    style={{ display: "inline-block" }}>
                    Player Score: {snake.score}
                  </div>
                } else {
                  return <div
                    key={snake.score}
                    style={{ display: "inline-block" }}>
                    CPU Score: {snake.score}
                  </div>
                }
              })()}
            </ReactCSSTransitionGroup>
          </div>
        </div>
      ))}
      <div className="child" style={{ 'width': '23%', paddingLeft: '5px' }}>
        <div className="vsCPUsettings">
          <div style={{ paddingTop: '2px', paddingRight: '42px' }}>
            {PauseOption}
          </div>
          {SoundOption}
        </div>
      </div>
    </div>


  let selectGameModeOption = (gameMode) => {
    switch (gameMode) {
      case "singlePlayer":
        return singlePlayerOptions
      case "vsCPU":
        return vsCpuOptions
      case "multiplayer":
        return multiplayerOptions
    }
  }

  return (
    <div>
      {selectGameModeOption(props.gameMode)}
    </div>
  );
};
