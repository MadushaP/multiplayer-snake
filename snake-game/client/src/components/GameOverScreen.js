import React from 'react'
import Modal from 'react-modal'
const restartIcon = require('../assets/images/restart.png')
const backIcon = require('../assets/images/back.png')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    height: '260px',
    width: '300px',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
    border: '5px solid rgb(224 43 125)',
    borderRadius: '20px',
    transform: 'translate(-50%, -50%)',
    paddingBottom: '39px',
    paddingTop: '10px',
    overflow: 'hidden'
  }
}

export default (props) => {

  const restartGame = () => {
    props.setGameOver(false)
    if(props.gameMode == "singlePlayer" ) {
      props.playerSnakeArrayRef.current = [{
        playerId: 0,
        snakeCells: [
          { 'x': 10, 'y': 10 },
          { 'x': 12, 'y': 10 },
          { 'x': 14, 'y': 10 },
          { 'x': 16, 'y': 10 },
        ],
        direction: "right",
        closeToFood: false,
        aiStatus: false,
        colour: '48df08',
        score: 0,
        status: 'none'
      }]
    } else if (props.gameMode == "multiplayer" ) {
      props.socket.emit("restart")
      props.isGameOverRef.current = false
    }
    
  }

  const backToMenu = () => {
    window.location.reload()

  }

  return (
    <div className="modal">
      <Modal
        isOpen={props.isGameOver}
        style={customStyles}
        shouldCloseOnOverlayClick={false} >
        <div className="game-over">
          <div style={{ 'font-weight': 'bold', 'margin-bottom': '10px' }}>Game Over</div>
          <div>Score: {props.gameOverScore}</div>
        </div>
        <div className="gameOverContainer">
          <div className="iconWrapper"  onClick={() => backToMenu()} >
            <img className="backIcon" src={backIcon}/>
          </div>
          <div className="iconWrapper">
            <img className="restartIcon" src={restartIcon} onClick={() => restartGame()} />
          </div>
          <p className="iconText">Back</p>
          <p className="iconText">Restart</p>
        </div>
      </Modal>
    </div>
  )
}