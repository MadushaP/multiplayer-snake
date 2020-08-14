import React from 'react'
import Modal from 'react-modal'
import FancyButton from './FancyButton'
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    height: '200px',
    width: '300px',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    transform: 'translate(-50%, -50%)',
    paddingBottom: '39px',
    paddingTop: '10px',
    overflow: 'hidden'
  }
}

export default (props) => {

  const afterOpenModal = () => {
    //Confetti effects? 
  }

  const closeModal= () => {
    props.setGameOver(false)
    window.location.reload()
  }

  const getPlayerScore = () => {
    if(props.playerSnakeArrayRef.current.find(snake => snake.playerId == props.playerId)) {
      return props.playerSnakeArrayRef.current.find(snake => snake.playerId == props.playerId).score
    }
  }
  
  return (
    <div className="modal">
      <Modal
        isOpen={props.isGameOver}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false} >
        <div className="game-over">
          <div style={{'font-weight':'bold', 'margin-bottom': '10px' }}>Game Over</div>
          <div>Score: {getPlayerScore()}</div>
        </div>
        <FancyButton text="restart" buttonClick={closeModal} />
      </Modal>
    </div>
  )
}