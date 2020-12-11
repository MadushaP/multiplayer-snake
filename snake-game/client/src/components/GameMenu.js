import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FancyButton from './FancyButton'
import SettingsToolTip from '../components/SettingsTooltip'

const snakeMenuImage = require('../assets/images/snake-menu-picture.png')
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
    'border': '1px black',
    overflow: 'visible'

  }
}

export default (props) => {
  const [show, setShow] = useState(false)
  const [hover, setHoverState] = useState(false)
  const [subSettingsFlags, setSubSettingsFlags] = useState(localStorage.getItem('visualiserType'))

  useEffect(() => {
    if (subSettingsFlags == 'web') {
      localStorage.setItem('visualiserType', 'web')
      props.setMenuSettings(setting => {
        const newObject = { ...setting }
        newObject.waveSettings = {
          stroke: 1,
          type: "web",
          colors: ["white", "white", "white"]
        }
        newObject.song = "song10"
        return newObject
      })
    }
    else if (subSettingsFlags == 'star') {
      localStorage.setItem('visualiserType', 'star')
      props.setMenuSettings(setting => {
        const newObject = { ...setting }
        newObject.waveSettings = {
          stroke: 1,
          type: "star",
          colors: ["yellow", "yellow", "red"]
        }
        newObject.song = "song9"
        return newObject
      })
    }
  }, [subSettingsFlags])


  const showTooltip = bool => {
    if (bool)
      setHoverState(true)
    setShow(bool)
  }


  const closeModal = () => {
    props.setGameOver(false)
    window.location.reload()
  }

  const startSinglePlayer = () => {
    props.setGameStart(true)
    props.setGameMode("singlePlayer")
    props.gameModeRef.current = "singlePlayer"
    props.setAiSpeed(8)
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
      score: 0,
      status: 'none'


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
      score: 0,
      status: 'none'

    }]
  }

  const startMultiplayer = () => {
    props.setGameMode("multiplayer")
    props.gameModeRef.current = "multiplayer"
    props.setGameStart(true)
  }

  const startVsCPU = () => {
    props.setGameStart(true)
    props.setGameMode("vsCPU")
    props.gameModeRef.current = "vsCPU"
    props.setAiSpeed(4)

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

  const clickBackground = () => {
    setShow(show => {
      if (hover)
        return true

      return false
    })
  }

  return (
    <div onClick={() => clickBackground()} >
      <Modal
        isOpen={!props.gameStart}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        overlayClassName="menu-overlay"
        ariaHideApp={false}>
        <img src={snakeMenuImage} className="snake-menu-image"></img>
        <div onMouseEnter={() => showTooltip(false)} style={{ "display": "inline-flex", "width": "92%", "justifyContent": "center" }}>
          <FancyButton text="Single player" buttonClick={startSinglePlayer} />
          <FancyButton text="vs CPU" buttonClick={startVsCPU} />
          <FancyButton text="Multiplayer" buttonClick={startMultiplayer} />
        </div>
        <SettingsToolTip menuSettings={props.menuSettings} menuSettings={props.menuSettings} setMenuSettings={props.setMenuSettings} showTooltip={showTooltip} setHoverState={setHoverState} show={show} subSettingsFlags={subSettingsFlags} setSubSettingsFlags={setSubSettingsFlags}/>
      </Modal>
    </div>
  )
}