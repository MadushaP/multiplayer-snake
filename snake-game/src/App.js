import React, { useState, useEffect } from 'react';
import Snake from './Snake';

function App() {

  let direction = "right"

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        direction = "right";
        break
      case "ArrowLeft":
        direction = "left";
        break
      case "ArrowDown":
        direction = "down";
        break
      case "ArrowUp":
        direction = "up";
        break
    }
  }

  function updateBody(snakeCells) {
    let updatedCells = [...snakeCells]
    updatedCells[0][0] = snakeCells[1][0]
    updatedCells[0][1] = snakeCells[1][1]

    updatedCells[1][0] = snakeCells[2][0]
    updatedCells[1][1] = snakeCells[2][1]

    updatedCells[2][0] = snakeCells[3][0]
    updatedCells[2][1] = snakeCells[3][1]
console.log(updatedCells)
    return updatedCells;
  }

  

  function tick() {
    switch (direction) {
      case "right":
        moveSnake(snakeCells => {
         let updatedCells = updateBody([...snakeCells])
          updatedCells[3][0] += 2;
          return updatedCells;
        })
        break

      case "left":
        moveSnake(snakeCells => {
          let updatedCells = updateBody([...snakeCells])
          updatedCells[3][0] -= 2;
          return updatedCells;
        })
        break

      case "down":
        moveSnake(snakeCells => {
          let updatedCells = updateBody([...snakeCells])
          updatedCells[3][1] += 2;
          return updatedCells;
        })
        break

      case "up":
        moveSnake(snakeCells => {
          let updatedCells = updateBody([...snakeCells])
          updatedCells[3][1] -= 2;
          return updatedCells;
        })
        break
    }

  }
  useEffect(() => console.log(snakeCells))

  useEffect(() => {
    const interval = setInterval(() => { tick() }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keypress)
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
