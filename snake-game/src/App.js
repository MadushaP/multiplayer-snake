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

    return updatedCells;
  }

  function outOfBoundsCheck(snakeHead) {
    if (snakeHead[3][0] > 99 || snakeHead[3][0] < 0
      || snakeHead[3][1] < 0 || snakeHead[3][1] > 99) {
      window.location.reload();
    } else
      return false;
  }


  function tick() {
    let updatedCells = updateBody(snakeCells)
    outOfBoundsCheck(updatedCells)
    let snakeHead = updatedCells.slice(-1)[0]

    switch (direction) {
      case "right":
        snakeHead[0] += 2;
        moveSnake(updatedCells)
        break

      case "left":
        snakeHead[0] -= 2;
        moveSnake(updatedCells)
        break

      case "down":
        snakeHead[1] += 2;
        moveSnake(updatedCells)
        break

      case "up":
        snakeHead[1] -= 2;
        moveSnake(updatedCells)
        break
    }

  }

  useEffect(() => {
    const interval = setInterval(() => { tick() }, 500);
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
