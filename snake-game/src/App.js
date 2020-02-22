import React, { useState, useEffect } from 'react';
import Snake from './Snake';
import Food from './Food';

function App() {

  useEffect(() => {
    window.addEventListener('keydown', keypress)
  }, []);

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        setDirection("right")
        break
      case "ArrowLeft":
        setDirection("left")
        break
      case "ArrowDown":
        setDirection("down")
        break
      case "ArrowUp":
        setDirection("up")
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

  function checkFood(snakeHead) {
    if(JSON.stringify(snakeCells.slice(-1)[0]) === JSON.stringify(food)) {
      setFood(randomLocation())
      setSpeed(speed - 10)
    }
  }

  function tick() {
    let updatedCells = updateBody(snakeCells)
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

    checkFood(snakeHead)
    outOfBoundsCheck(updatedCells)
    setSnake(updatedCells)
  }

  function randomLocation() {
    let x = Math.floor( Math.random() * 100 / 2 ) * 2;
    let y =  Math.floor( Math.random() * 100 / 2 ) * 2;
    return [x,y]
  }

  const [snakeCells, setSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0],
  ]);
  
  const [food, setFood] = useState(randomLocation());
  const [speed, setSpeed] = useState(100);
  const [direction, setDirection] = useState("right")

  useEffect(() => {
    const interval = setInterval(() => { tick() }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food]);

  return (
    <div className="game-area" >
      <Snake snake={snakeCells} />
      <Food food={food} />
    </div>
  );
}

export default App;
