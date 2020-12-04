import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FancyButton from './FancyButton'
import Tooltip from 'react-power-tooltip'
import Toggle from "react-toggle";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';


const snakeMenuImage = require('../assets/images/snake-menu-picture.png')
const settingImage = require('../assets/images/settings.png')
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

  const [subSettingsFlags, setSubSettingsFlags] = useState(localStorage.getItem('visualiserType'));

  useEffect(() => {
    if(subSettingsFlags == 'web') {
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
    else if(subSettingsFlags == 'star') {
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



  const handleChange = (event) => {
    setSubSettingsFlags(event.target.value);
  };

  const showTooltip = bool => {
    if (bool)
      setHoverState(true)
    setShow(bool)
  }

  const clickBackground = () => {
    setShow(show => {
      if (hover)
        return true

      return false
    })
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
    // console.log("Started multiplayer player")
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
        <div className="menuSettings"
          onMouseEnter={() => showTooltip(true)}
          onMouseLeave={() => setHoverState(false)}>
          <div style={{ "float": "right" }}>
            <img src={settingImage} width="60" height="60"></img>
            <div
              style={{ position: 'relative'}}>
              <Tooltip show={show}
                position="bottom center"
                animation="bounce"
                arrowAlign="center"
                background="#181818"
                textBoxWidth="250px"   >
                <span key="header" className="headerText">Settings</span>
                <span className="settingText" >
                  <div style={{ 'marginBottom': '10px' }}>
                    <div style={{ 'display': 'inline-flex', 'top': '50%' }}>
                      Visualiser
                    </div>
                    <div style={{ 'float': 'right' }}>
                      <Toggle defaultChecked={props.menuSettings.visualiser} onChange={() => {
                        props.setMenuSettings(setting => {
                          const newObject = { ...setting }
                          localStorage.setItem('visualiser', !setting.visualiser)
                          newObject.visualiser = !setting.visualiser
                          return newObject
                        })
                      }} />
                    </div>
                  </div>
                </span>
                <span className={props.menuSettings.visualiser ? "subSettingText subSettingShadow" : "settingText disable"}>
                  <FormControl style={{ 'float': 'right' }} component="fieldset">
                    <FormLabel   style={{ 'float': 'right', 'marginLeft': '44px',   'marginBottom': '8px' }} component="legend">Type</FormLabel>
                    <RadioGroup aria-label="type" value={subSettingsFlags ? subSettingsFlags : 'web'} onChange={handleChange}>
                      <FormControlLabel value="web" control={<Radio  />} label="Web" labelPlacement="start" />
                      <FormControlLabel value="star" control={<Radio />} label="Star" labelPlacement="start" />
                    </RadioGroup>
                  </FormControl>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}