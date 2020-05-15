import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen'
import AI from './Ai'

const helper = require('./helper.js');
const acronyms = require('./acronyms.js');
const gamepad = require('./gamepad.js');

function App() {
  const [score, setScore] = useState(0)
  const [food, setFood] = useState(randomLocation())
  const [speed, setSpeed] = useState(50)
  const [direction, setDirection] = useState("right")
  const prevDirection = usePrevious(direction)
  const [aiStatus, setAi] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isGameOver, setGameOver] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const [snakeCells, setSnake] = useState([
    { 'x': 0, 'y': 0 },
    { 'x': 2, 'y': 0 },
    { 'x': 4, 'y': 0 },
    { 'x': 6, 'y': 0 },
  ]);

  const [acronymMap, setAcronymsMap] = useState(acronyms);
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const [closeToFood, setCloseToFood] = useState(false);

  //try this on in use effect
  gamepad.load(setDirection)


  useEffect(() => {
    window.addEventListener('keydown', keypress)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;

      if (!aiStatus) {
        tick()
      } else {
        AI.tick(snakeCells, food, updateBody, setSpeed,
          setSnake, setDirection, direction, foodCheck)
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food, snakeCells]);

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
    return { 'x': x, 'y': y }
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

  function gameOver() {
    setGameOver(true)
    playSound('game-over.mp3')
  }

  function headBodyCollisionCheck(snakeHead) {
    let snakeBody = snakeCells.slice(0, -1)

    if (helper.isArrayInArray(snakeBody, snakeHead)) {
      gameOver()
    }
  }

  function outOfBoundsCheck(snakeHead) {
    if (snakeHead.x > 99 || snakeHead.x < 0
      || snakeHead.y < 0 || snakeHead.y > 99) {
      gameOver()
    } else
      return false;
  }

  function hasEatenFood(snakeHead) {
    return helper.arrayEquals(snakeHead, food);
  }

  function playSound(sound) {
    var bloop = new Audio(sound)
    bloop.volume = volume
    bloop.play()
  }

  function increaseSnakeLength(updatedCells) {
    let snakeTail = updatedCells[0]
    updatedCells.unshift({ 'x': snakeTail.x, 'y': snakeTail.y })
  }

  function handleCloseToFood(snakeHead) {
    let distanceX = Math.abs(food.x - snakeHead.x)
    let distanceY = Math.abs(food.y - snakeHead.y)

    if (distanceX < 10 && distanceY < 10) {
      setCloseToFood(true)
    }
    else {
      setCloseToFood(false)
    }
  }

  function foodCheck(snakeHead, updatedCells) {
    handleCloseToFood(snakeHead, updatedCells)
    if (hasEatenFood(snakeHead)) {
      setConfetti(true)
      setFood(randomLocation())
      // setSpeed(speed - 10)
      setScore(score => score + 1)
      setAcronym(helper.randomItem(acronymMap))
      playSound('bloop.mp3')
      increaseSnakeLength(updatedCells)
    }
    else {
      setConfetti(false)
    }
  }

  function tick() {

    let updatedCells = updateBody(snakeCells)
    let snakeHead = updatedCells.slice(-1)[0]

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
    foodCheck(snakeHead, updatedCells)

    setSnake(updatedCells)
  }

  return (
    <div>
      <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
      <ScoreBoard score={score} setAi={setAi} aiStatus={aiStatus} setVolume={setVolume} volume={volume} fullWord={currentAcronym.fullWord} />
      <div className="game-area">
        <Snake snake={snakeCells} direction={direction} closeToFood={closeToFood} />
        <Food food={food} currentAcronym={currentAcronym} showConfetti={showConfetti} />
      </div>
    </div>
  );
}

export default App;
