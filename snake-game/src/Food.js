import React from 'react'
import Confetti from 'react-dom-confetti'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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

export default (props) => {
    const style = {
        left: `${props.food.x}%`,
        top: `${props.food.y}%`,
        position: 'absolute'
    }
    let confStyle = {
        left: `${props.confettiLocation.x}%`,
        top: `${props.confettiLocation.y}%`,
        position: 'absolute'
    }
    return (
        <div>
            <div style={confStyle}>
                <Confetti active={props.showConfetti} config={config} />
            </div>
            <div className="food" style={style}>
                {props.acronymStatus ?
                    <div className="foodText"> {props.currentAcronym.acronym}
                        <ReactCSSTransitionGroup
                            transitionName="foodAnswer"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            <h1 key={props.currentAcronym.fullWord} >
                                <span aria-hidden="true" id="answer">{props.currentAcronym.fullWord} </span>
                            </h1>
                        </ReactCSSTransitionGroup>
                    </div> : null}
            </div>
        </div>)
}
