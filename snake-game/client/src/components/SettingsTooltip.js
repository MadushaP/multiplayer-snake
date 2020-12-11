import React from 'react'
import Tooltip from 'react-power-tooltip'
import Toggle from "react-toggle"
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import Sound from '../lib/Sound'

const settingImage = require('../assets/images/settings.png')

export default (props) => {
  const handleChange = (event) => {
    props.setSubSettingsFlags(event.target.value)
  };

  return (
    <div className="menuSettings"
      onMouseEnter={() => props.showTooltip(true)}
      onMouseLeave={() => props.setHoverState(false)}>
      <div style={{ "float": "right" }}>
        <img src={settingImage} width="60" height="60"></img>
        <div
          style={{ position: 'relative' }}>
          <Tooltip show={props.show}
            position="bottom center"
            animation="bounce"
            arrowAlign="center"
            background="#181818"
            textBoxWidth="250px"   >
            <span key="header" className="headerText">Settings</span>
            <span className="settingText">
              <div style={{ 'display': 'inline-flex', 'top': '50%' }}>
                Sound
              </div>
              <div style={{ 'float': 'right' }}>
                <Toggle defaultChecked={!Sound.getMuteStatus()} onChange={() => {
                  Sound.muteSwitch()
                }} />
              </div>
            </span>
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
                <FormLabel style={{ 'float': 'right', 'marginLeft': '44px', 'marginBottom': '8px' }} component="legend">Type</FormLabel>
                <RadioGroup aria-label="type" value={props.subSettingsFlags ? props.subSettingsFlags : 'web'} onChange={handleChange}>
                  <FormControlLabel value="web" control={<Radio />} label="Web" labelPlacement="start" />
                  <FormControlLabel value="star" control={<Radio />} label="Star" labelPlacement="start" />
                </RadioGroup>
              </FormControl>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}