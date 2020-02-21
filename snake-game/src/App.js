import React, { useState, useEffect } from 'react';
import Snake from './Snake';
import Food from './Food';

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

    for (let cell = 0; cell < updatedCells.length - 1; cell++) {
      for (let i = 0; i < 2; i++) {
        updatedCells[cell][i] = snakeCells[cell + 1][i]
      }
    }
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
        break
      case "left":
        snakeHead[0] -= 2;
        break
      case "down":
        snakeHead[1] += 2;
        break
      case "up":
        snakeHead[1] -= 2;
        break
    }

    moveSnake(updatedCells)
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
    [6, 0],
  ]);


  return (
    <div className="game-area" >
      <Snake snake={snakeCells} />
      <Food />

    </div>
  );
}

export default App;
