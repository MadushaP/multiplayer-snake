import React from 'react'
import Modal from 'react-modal'
import HighScore from './HighScore'

const restartIcon = require('../assets/images/restart.png')
const backIcon = require('../assets/images/back.png')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '450px',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
    border: '5px solid rgb(224 43 125)',
    borderRadius: '20px',
    transform: 'translate(-50%, -50%)',
    paddingBottom: '10px',
    paddingTop: '10px',
    overflow: 'hidden'
  }
}

export default (props) => {

  const restartGame = () => {
    props.speedRef.current = 5
    props.setGameOver(false)
    if(props.gameMode === "singlePlayer" ) {
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
      props.setAiUsedFlag(false)
    } 
    else if ( props.gameMode === "vsCPU") {
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
        score: 0
  
      },
      {
        playerId: 1,
        snakeCells: [
          { 'x': 10, 'y': 10 },
          { 'x': 12, 'y': 10 },
          { 'x': 14, 'y': 10 },
          { 'x': 16, 'y': 10 },
        ],
        direction: "right",
        closeToFood: false,
        aiStatus: true,
        colour: 'C70039',
        score: 0
      }]

    }
    else if (props.gameMode === "multiplayer" ) {
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
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false} >
        <div className="game-over">
          <div style={{ 'fontWeight': 'bold', 'marginBottom': '10px' }}>Game Over</div>
          <HighScore gameOverScore={props.gameOverScore} gameMode={props.gameMode} aiUsedFlag={props.aiUsedFlag} />
        </div>
        <div className="gameOverIconContainer">
          <div className="iconWrapper"  onClick={() => backToMenu()} >
            <img title="backIcon" alt="back" className="backIcon" src={backIcon}/>
          </div>
          <div className="iconWrapper">
            <img title="restartIcon" alt="restart" className="restartIcon" src={restartIcon} onClick={() => restartGame()} />
          </div>
          <p className="iconText">Back</p>
          <p className="restartText">Restart</p>
        </div>
      </Modal>
    </div>
  )
}