import React from 'react'
import Confetti from 'react-dom-confetti'

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
        }, 3000)
    }

    const blinkCss = () => {
      if (props.isNewLevel) {
        resetIsNewLevel()
        return "level-up blink"
      } else {
        return "level-up"
      }
    }


    return (
        <div id='wrapper'>
            <canvas
                ref={props.canvasRef}
                width="1300"
                height="1175"
                style={{ border: '5px solid rgba(224, 43, 125, 1)', borderRadius: '15px' }}>
            </canvas>
            <div style={confStyle}>
                <Confetti style={confStyle} active={props.showConfetti} config={config} />
            </div>
            <img key={props.isNewLevel} src="level-up.png" className={blinkCss()}></img>
        </div>
    )
}