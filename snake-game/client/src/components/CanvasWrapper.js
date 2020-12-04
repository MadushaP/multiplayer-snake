import React, { useEffect } from 'react'
import Confetti from 'react-dom-confetti'
const levelUpImage = require('../assets/images/level-up.png')
const frozenTextImage = require('../assets/images/frozen-text.png')
const gunTextImage = require('../assets/images/gun-text.png')

export default (props) => {
  let confStyle = {
    left: `${props.food.x}px`,
    top: `${props.food.y}px`,
    position: 'absolute',

  }

  const config = {
    angle: "360",
    spread: "360",
    startVelocity: "22",
    elementCount: "20",
    dragFriction: "0.05",
    duration: "1350",
    stagger: 0,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  }

  const resetIsNewLevel = () => {
    setTimeout(() => {
      props.setIsNewLevel(false)
    }, 2000)
  }


  const blinkCss = () => {
    if (props.isNewLevel) {
      resetIsNewLevel()
      return "level-up blink"
    } else {
      return "level-up "
    }
  }

  const frozenCss = () => {
    if (props.powerUpText) {
      return "frozenText fadeIn"
    } else {
      return "frozenText"
    }
  }

  const powerUpText = () => {
    if (props.powerUpText == "frozen") {
      return frozenTextImage
    } else if (props.powerUpText == "gun") {
      return gunTextImage
    }
  }

  useEffect(() => {
    if(props.menuSettings.visualiser) {
      var audio = document.getElementById("audio");
      audio.volume = 0.5;
    }
  }, [])

  return (
    <div id='wrapper'>
      <div id="gameBackground"></div>
      {props.menuSettings.visualiser ? <canvas id="wave" width="1300" height="1175"></canvas> : null}
      <canvas id="game" ref={props.canvasRef} width="1300" height="1175"></canvas>
      { props.menuSettings.visualiser ? <audio
        id="audio"
        autoPlay
        controls
        src={require(`../assets/sounds/${props.song}.mp3`)}>
      </audio> : null}
      <div style={confStyle}>
        <Confetti style={confStyle} active={props.showConfetti} config={config} />
      </div>
      <img key={props.isNewLevel} src={levelUpImage} className={blinkCss()}></img>
      <img key={props.powerUpText} src={powerUpText()} className={frozenCss()}></img>
    </div>
  )
}