import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';
import AI from './Ai'
var helper = require('./helper.js');

function App() {
  const [score, setScore] = useState(0);
  const [food, setFood] = useState(randomLocation());
  const [speed, setSpeed] = useState(100);
  const [direction, setDirection] = useState("right")
  const prevDirection = usePrevious(direction);
  const [aiStatus, setAi] = useState(false);

  const [snakeCells, setSnake] = useState([
    {'x':0, 'y':0},
    {'x':2, 'y':0},
    {'x':4, 'y':0},
    {'x':6, 'y':0},
  ]);

  useEffect(() => {
    window.addEventListener('keydown', keypress)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!aiStatus) {
        tick()
      } else {
        AI.tick(snakeCells, food, updateBody, outOfBoundsCheck,
          setFood, hasEatenFood, randomLocation, setSpeed,
          speed, setScore, setSnake, setDirection, direction)
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food, snakeCells]);

 
  //Request animation 60 fps
  // const requestRef = React.useRef();
  // const previousTimeRef = React.useRef(1);
  // const animate = time => {
  //   if (previousTimeRef.current != undefined) {
  //     const deltaTime = time - previousTimeRef.current;
  //     tick()
  //   }
  //   previousTimeRef.current = time  + (10 * 0.01) % 100;
  //   requestRef.current = requestAnimationFrame(animate);
  // }

  // React.useEffect(() => {
  //   requestRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(requestRef.current);
  // }, [speed, direction, food, snakeCells]); // Make sure the effect runs only once

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes

    return ref;
  }
  function randomLocation() {
    let x = Math.floor(Math.random() * 100 / 2) * 2;
    let y = Math.floor(Math.random() * 100 / 2) * 2;
    return {'x':x, 'y':y}
  }

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        if (prevDirection.current != "left")
          setDirection("right")
        break
      case "ArrowLeft":
        if (prevDirection.current != "right")
          setDirection("left")
        break
      case "ArrowDown":
        if (prevDirection.current != "up")
          setDirection("down")
        break
      case "ArrowUp":
        if (prevDirection.current != "down")
          setDirection("up")
        break
    }
  }

  function updateBody(snakeCells) {
    let updatedCells = [...snakeCells]
    for (let cell = 0; cell < updatedCells.length - 1; cell++) {
        updatedCells[cell].x = snakeCells[cell + 1].x 
        updatedCells[cell].y = snakeCells[cell + 1].y
    }

    return updatedCells;
  }

  function headBodyCollisionCheck(snakeHead) {
    let snakeBody = snakeCells.slice(0, -1)

    if (helper.isArrayInArray(snakeBody, snakeHead)) {
      window.location.reload();
    }
  }

  function outOfBoundsCheck(snakeHead) {
    if (snakeHead.x > 99 || snakeHead.x < 0
      || snakeHead.y < 0 || snakeHead.y > 99) {
      window.location.reload();
    } else
      return false;
  }

  function hasEatenFood(snakeHead) {
    return helper.arrayEquals(snakeHead, food);
  }

  function tick() {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = updatedCells.slice(-1)[0]
    let snakeTail = updatedCells[0]

    switch (direction) {
      case "right":
        snakeHead.x += 2;
        break
      case "left":
        snakeHead.x -= 2;
        break
      case "down":
        snakeHead.y += 2;
        break
      case "up":
        snakeHead.y -= 2;
        break
    }

    outOfBoundsCheck(snakeHead)
    headBodyCollisionCheck(snakeHead)

    if (hasEatenFood(snakeHead)) {
      setFood(randomLocation())
      // setSpeed(speed - 10)
      setScore(score => score + 1)

      updatedCells.unshift({'x':snakeTail.x, 'y':snakeTail.y})
      setSnake(updatedCells)
    } else {
      setSnake(updatedCells)
    }
  }

  function setAiStatus() {
    if (aiStatus)
      setAi(false)
    else
      setAi(true)
  }

  return (
    <div>
      <ScoreBoard score={score} setAi={setAiStatus} aiStatus={aiStatus} />
      <div className="game-area" >
        <Snake snake={snakeCells} />
        <Food food={food} />
      </div>
    </div>
  );
}

export default App;
