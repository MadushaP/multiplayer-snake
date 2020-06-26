import React from 'react'

export default (props) => {

  return (
    <div>
      <nav>
        <ul>
          <li onClick={props.buttonClick} style={{'userSelect': 'none'}}>
            {props.text}
              <span></span><span></span><span></span><span></span>
          </li>
        </ul>
      </nav>
    </div>
  )
}