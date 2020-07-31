import React from 'react'

export default (props) => {
  const playSound = (sound, loop) => {
    var sound = new Audio(sound)
    sound.volume = 0.8 
    sound.play()
  }

  return (
    <div >
      <nav>
        <ul onMouseEnter={() => playSound('tap.mp3')}>
          <li onClick={props.buttonClick} style={{'userSelect': 'none'}}>
            {props.text}
              <span></span><span></span><span></span><span></span>
          </li>
        </ul>
      </nav>
    </div>
  )
}