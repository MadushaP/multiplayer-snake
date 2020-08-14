import React from 'react'
import {playSound} from '../lib/Sound'

export default (props) => {
  return (
    <div >
      <nav>
        <ul onMouseEnter={() => playSound('tap.mp3')}>
          <li onClick={props.buttonClick} style={{ 'userSelect': 'none' }}>
            {props.text}
            <span></span><span></span><span></span><span></span>
          </li>
        </ul>
      </nav>
    </div>
  )
}