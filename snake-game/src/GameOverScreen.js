import React from 'react'
import Modal from 'react-modal'
import FancyButton from './FancyButton'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    height: '200px',
    width: '300px',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
    transform: 'translate(-50%, -50%)',
    border: '2px solid rgba(224, 43, 125, 1)'
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

  return (
    <div className="modal">
      <Modal
        isOpen={props.isGameOver}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false} >
        <div className="game-over">
          <div>Game Over</div>
        </div>
        <FancyButton text="restart" buttonClick={closeModal} />
      </Modal>
    </div>
  )
}