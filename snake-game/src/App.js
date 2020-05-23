import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen'
import AI from './Ai'
import io from 'socket.io-client';
const socket = io('http://192.168.1.11:3001/');

const helper = require('./helper.js');
const acronyms = require('./acronyms.js');
const gamepad = require('./gamepad.js');

function randomLocation() {
  let x = Math.floor(Math.random() * 100 / 2) * 2;
  let y = Math.floor(Math.random() * 100 / 2) * 2;
  return { 'x': x, 'y': y }
}

function App() {
  const [score, setScore] = useState(0)
  const [food, setFood] = useState(randomLocation())
  const [speed, setSpeed] = useState(100)
  const [direction, setDirection] = useState("right")
  const prevDirection = usePrevious(direction)
  const [aiStatus, setAi] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isGameOver, setGameOver] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const [confettiLocation, setConfettiLocation] = useState(food);

  const [snakeCells, setSnake] = useState([
    { 'x': 0, 'y': 0 },
    { 'x': 2, 'y': 0 },
    { 'x': 4, 'y': 0 },
    { 'x': 6, 'y': 0 },
  ]);

  const [acronymMap, setAcronymsMap] = useState(acronyms);
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const [closeToFood, setCloseToFood] = useState(false);
  const [acronymStatus, setAcronymStatus] = useState(false);

  gamepad.load(setDirection, prevDirection.current)
  
  const [snakeCells2, setSnake2] = useState([
    { 'x': 10, 'y': 10 },
    { 'x': 12, 'y': 10 },
    { 'x': 14, 'y': 10 },
    { 'x': 16, 'y': 10 },
  ]);
  const [direction2, setDirection2] = useState("right")
  const [closeToFood2, setCloseToFood2] = useState(false);
  const prevDirection2 = usePrevious(direction2)

  const [playerCount, setPlayerCount] = useState(0);

  const [playerSnakeArray, setPlayerSnakeArray] = useState([
    {'playerId': '1',
     'snakeCells': snakeCells,
    }
  ]);

  useEffect(() => {
    window.addEventListener('keydown', keypress)
    window.addEventListener('keydown', keypress2)


    socket.emit('getFood', 'getFood');

    socket.on('playerCount', (data) => {
      setPlayerCount(data)
    })

    socket.on('sendFood', (data) => {
      setFood(data)
    } )

    socket.on('updateDirectionBroadcast', (data) => {
      setDirection(data)
    } )
 

    socket.on('updateBodyBroadcast', (data) => {
      setSnake(data)
    } )

    socket.on('updateFoodBroadcast', (data) => {
      setFood(data)
    } )

    //Player 2
    socket.on('updateBodyBroadcast2', (data) => {
      setSnake2(data)
    } )

    socket.on('updateDirectionBroadcast2', (data) => {
      setDirection2(data)
    } )
 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;

      if (!aiStatus) {
       tick(snakeCells ,setSnake, direction, setCloseToFood, closeToFood, 1)
       if(playerCount > 1){    
         tick(snakeCells2, setSnake2, direction2, setCloseToFood2, closeToFood2, 2)
        }

      } else {
        AI.tick(snakeCells, food, updateBody, setSpeed,
          setSnake, setDirection, direction, foodCheck, setCloseToFood, closeToFood)
          AI.tick(snakeCells2, food, updateBody, setSpeed,
            setSnake2, setDirection2, direction2, foodCheck, setCloseToFood2, closeToFood2)
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food, direction2, snakeCells, snakeCells2, setCloseToFood2,closeToFood2,playerSnakeArray, setPlayerSnakeArray ]);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes

    return ref;
  }


  function keypress2({ key }) {
    switch (key) {
      case "d":
        if (prevDirection2.current !== "left")
          setDirection2("right")
          socket.emit('updateDirection2', "right");
        break
      case "a":
        if (prevDirection2.current !== "right")
          setDirection2("left")
          socket.emit('updateDirection2', "left");
        break
      case "s":
        if (prevDirection2.current !== "up")
          setDirection2("down")
          socket.emit('updateDirection2', "down");
        break
      case "w":
        if (prevDirection2.current !== "down")
          setDirection2("up")
          socket.emit('updateDirection2', "up");
        break
      default:
        break;
    }
  }

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        if (prevDirection.current !== "left")
          setDirection("right")
          socket.emit('updateDirection', "right");
        break
      case "ArrowLeft":
        if (prevDirection.current !== "right")
          setDirection("left")
          socket.emit('updateDirection', "left");
        break
      case "ArrowDown":
        if (prevDirection.current !== "up")
          setDirection("down")
          socket.emit('updateDirection', "down");
        break
      case "ArrowUp":
        if (prevDirection.current !== "down")
          setDirection("up")
          socket.emit('updateDirection', "up");
        break
      default:
        break;
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
    // bloop.play()
  }

  function increaseSnakeLength(updatedCells) {
    let snakeTail = updatedCells[0]
    updatedCells.unshift({ 'x': snakeTail.x, 'y': snakeTail.y })
  }

  function handleCloseToFood(snakeHead,setCloseToFood, closeToFood) {
    let distanceX = Math.abs(food.x - snakeHead.x)
    let distanceY = Math.abs(food.y - snakeHead.y)

    if (distanceX < 12 && distanceY < 12) {
      if (!closeToFood) {
        playSound('mouth.mp3')
      }
      setCloseToFood(true)
    }
    else {
      setCloseToFood(false)
    }
  }

  function foodCheck(snakeHead, updatedCells, setCloseTofood, closeToFood) {
    handleCloseToFood(snakeHead, setCloseTofood, closeToFood)
    if (hasEatenFood(snakeHead)) {
      setConfettiLocation({ 'x': snakeHead.x, 'y': snakeHead.y })
      setConfetti(true)
      // let location = randomLocation()
      // setFood(location)
      socket.emit('randomFood');

      // setSpeed(speed - 10)
      setScore(score => score + 1)
      setAcronym(helper.randomItem(acronymMap))
      playSound('bling.mp3')
      increaseSnakeLength(updatedCells)
    }
    else {
      setConfetti(false)
    }
  }

  function tick(sc, setSnake, direction, setCloseToFood, closeToFood, player) {
    let updatedCells = updateBody(sc)
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
      default:
        break;
    }

    outOfBoundsCheck(snakeHead)
    // headBodyCollisionCheck(snakeHead)
    foodCheck(snakeHead, updatedCells, setCloseToFood, closeToFood)
    setSnake(updatedCells)
    if(player == 1)
    socket.emit('updateBody', updatedCells);
    else 
    socket.emit('updateBody2', updatedCells);


  }

  return (
    <div>
      <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
      <ScoreBoard score={score} setAi={setAi} setAcronymStatus={setAcronymStatus} acronymStatus={acronymStatus} aiStatus={aiStatus} setVolume={setVolume} volume={volume} fullWord={currentAcronym.fullWord} />
      <div className="game-area">
        <Snake num={1} snake={snakeCells} speed={speed} direction={direction} closeToFood={closeToFood} isGameOver={isGameOver} />
       {(playerCount > 1) ? <Snake num={2} snake={snakeCells2} speed={speed} direction={direction2} closeToFood={closeToFood2} isGameOver={isGameOver} /> : null} 
        <Food food={food} confettiLocation={confettiLocation} currentAcronym={currentAcronym} showConfetti={showConfetti} acronymStatus={acronymStatus} />
      </div>
    </div>
  );
}

export default App;
