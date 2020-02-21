import React, { useState, useEffect } from 'react';
import Snake from './Snake';

function App() {

  function keypress({ key }) {
    moveSnake(snakeCells => {
      console.log(key);
      console.log(snakeCells)
      return snakeCells.map(cells => [cells[0] + 2, cells[1]])
    })
  }

  useEffect(() => {
    window.addEventListener('keydown', keypress);
  }, []);

  const [snakeCells, moveSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0]
  ]);

  return (
    <div className="game-area" >
      <Snake snake={snakeCells} />
    </div>
  );
}

export default App;
