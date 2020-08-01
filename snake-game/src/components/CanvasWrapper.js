import React from 'react'
import Confetti from 'react-dom-confetti'

export default (props) => {
    let confStyle = {
        left: `${props.food.x * props.blockSize}px`,
        top: `${props.food.y * props.blockSize}px`,
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

    return (
        <div id='wrapper'>
            <canvas
                ref={props.canvasRef}
                width="1300"
                height="1175"
                style={{ border: '3px solid rgba(224, 43, 125, 1)'}}>

            </canvas>
            <div style={confStyle}>
                <Confetti style={confStyle} active={props.showConfetti} config={config} />
            </div>
        </div>
    )
}