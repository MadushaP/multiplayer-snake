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
    height: '400px',
    width: '800px',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50px',
    backgroundImage: 'linear-gradient(to top, #007adf 0%, #00ecbc 100%)',
    'border': '1px black'
  }
}

export default (props) => {

  const closeModal = () => {
    props.setGameOver(false)
    window.location.reload()
  }

  const startSinglePlayer = () => {
    props.setGameStart(true)
    props.setGameMode("singlePlayer")
    props.gameModeRef.current = "singlePlayer"

    props.setPlayerSnakeArray([{
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
      score:0

    }])
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

    }]
  }

  const startMultiplayer = () => {
    // console.log("Started multiplayer player")
    props.setGameMode("multiplayer")
    props.gameModeRef.current = "multiplayer"
    props.setGameStart(true)
  }

  const startVsCPU = () => {
    props.setGameStart(true)
    props.setGameMode("vsCPU")
    props.gameModeRef.current = "vsCPU"

    props.setPlayerSnakeArray([{
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
      score:0
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
      score:0
    }])

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
      score:0

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


  return (
    <div >
      <Modal
        isOpen={!props.gameStart}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        overlayClassName="menu-overlay"
        ariaHideApp={false}>
        <img src="Snake-Menu-Picture.png" className="snake-menu-image"></img>
        <div style={{ "display": "inline-flex" }}>
          <FancyButton text="Single player" buttonClick={startSinglePlayer} />
          <FancyButton text="vs CPU" buttonClick={startVsCPU} />
          <FancyButton text="Multiplayer" buttonClick={startMultiplayer} />
        </div>
      </Modal>
    </div>
  )
}