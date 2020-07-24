import React from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default (props) => {
  const setSound = () => {
    if (props.volume === 1) props.setVolume(0);
    else props.setVolume(1);
  };

  const setAiStatus = () => {
    let currentSnake = props.playerSnakeArray.find(
      (x) => x.playerId == props.playerId
    );
    if (currentSnake.aiStatus) {
      props.updateFieldChange(props.playerId, "aiStatus", false);
    } else {
      props.updateFieldChange(props.playerId, "aiStatus", true);
    }
  };

  const seAcronymStatus = () => {
    if (props.acronymStatus) props.setAcronymStatus(false);
    else props.setAcronymStatus(true);
  };

  let AIOption =
    <div style={{ width: "37%" }}>
      AI
      <Toggle
        className="spacing"
        style={{ paddingTop: "37%" }}
        defaultChecked={false}
        onChange={() => setAiStatus()}
      />
    </div>

  let SoundOption = (
    <div style={{ width: "60%" }}>
      Sound
      <Toggle
        className="spacing"
        defaultChecked={true}
        onChange={() => setSound()}
      />
    </div>
  );

  let AcronymOption =
    <div style={{ width: "71%" }}>
      {" "}
      Acronym
      <Toggle
        className="spacing"
        defaultChecked={props.acronymsStatus}
        onChange={() => seAcronymStatus()}
      />
    </div>

  let singlePlayerOptions =
    <div className="parent">
      <div className="child">
        <div className="scoreText">
          <ReactCSSTransitionGroup
            transitionName="score"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1}>
            <div
              key={props.score}
              style={{ display: "inline-block", paddingLeft: "5px" }}>
              Score: {props.score}
            </div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
      <div className="child" style={{ width: "500px" }}>
        <div className="fullWordText">
          {props.fullWord}
        </div>
      </div>
      <div className="settingContainer">
        <div className="settings">
          {AIOption}
          {SoundOption}
          {AcronymOption}
        </div>
      </div>
    </div>

  let multiplayerOptions =
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
                key={props.score}
                style={{ display: "inline-block" }}>
                P{index + 1}: {props.score}
              </div>
            </ReactCSSTransitionGroup>
          </div>
        </div>
      ))}
    </div>

  return (
    <div>
      {props.gameMode === "singlePlayer" ? singlePlayerOptions : multiplayerOptions}
    </div>
  );
};
