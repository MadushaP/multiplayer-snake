import React from 'react';

export default (props) => {

  return (
        <div className="game-over">
          <div>Game Over</div>
          <nav>
            <ul>
              <li onClick={props.closeModal}>
                Restart
              <span></span><span></span><span></span><span></span>
              </li>
            </ul>
          </nav>
        </div>
  );
}