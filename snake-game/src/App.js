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
  const [speed, setSpeed] = useState(50)
  const [direction, setDirection] = useState("right")
  const [aiStatus, setAi] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isGameOver, setGameOver] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const [confettiLocation, setConfettiLocation] = useState(food);

  // const [snakeCells, setSnake] = useState([
  //   { 'x': 0, 'y': 0 },
  //   { 'x': 2, 'y': 0 },
  //   { 'x': 4, 'y': 0 },
  //   { 'x': 6, 'y': 0 },
  // ]);

  const [acronymMap, setAcronymsMap] = useState(acronyms);
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const [closeToFood, setCloseToFood] = useState(false);
  const [acronymStatus, setAcronymStatus] = useState(false);


  const [direction2, setDirection2] = useState("right")
  const [closeToFood2, setCloseToFood2] = useState(false);

  const [playerCount, setPlayerCount] = useState(0);

  const [playerSnakeArray, setPlayerSnakeArray] = useState([
    {
      playerId: 1,
      snakeCells: [
        { 'x': 0, 'y': 0 },
        { 'x': 2, 'y': 0 },
        { 'x': 4, 'y': 0 },
        { 'x': 6, 'y': 0 },
      ],
      direction: "right",
      closeToFood: false
    },
    {
      playerId: 2,
      snakeCells: [
        { 'x': 10, 'y': 10 },
        { 'x': 12, 'y': 10 },
        { 'x': 14, 'y': 10 },
        { 'x': 16, 'y': 10 },
      ],
      direction: "right",
      closeToFood: false
    },
  ]);

  const prevDirection = usePrevious(playerSnakeArray[0].direction)
  const prevDirection2 = usePrevious(playerSnakeArray[1].direction)


  const updateFieldChanged = (index, prop, value) => {
    let newArr = [...playerSnakeArray];
    newArr[index][prop] = value;

    setPlayerSnakeArray(newArr);
  }

  useEffect(() => {
    window.addEventListener('keydown', keypress)
    window.addEventListener('keydown', keypress2)

    socket.on('playerCount', (data) => {
      setPlayerCount(data)
    })

    socket.emit('getFood', 'getFood');
    socket.on('sendFood', (data) => { setFood(data) })


    socket.on('updateDirectionBroadcast', (data) => { updateFieldChanged(0, 'direction', data) })
    socket.on('updateBodyBroadcast', (data) => { updateFieldChanged(0, 'snakeCells', data) })
    socket.on('updateFoodBroadcast', (data) => { setFood(data) })

    //Player 2
    socket.on('updateBodyBroadcast2', (data) => { updateFieldChanged(1, 'snakeCells', data) })
    socket.on('updateDirectionBroadcast2', (data) => { updateFieldChanged(1, 'direction', data) })

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;

      if (!aiStatus) {
        tick(playerSnakeArray[0].snakeCells, playerSnakeArray[0].direction, playerSnakeArray[0].closeToFood, playerSnakeArray[0].playerId - 1)
        if (playerCount > 1) {
          tick(playerSnakeArray[1].snakeCells, playerSnakeArray[1].direction, playerSnakeArray[1].closeToFood, playerSnakeArray[1].playerId - 1)
        }
      }
      // } else {
      //   AI.tick(snakeCells, food, updateBody, setSpeed,
      //     setSnake, setDirection, direction, foodCheck, setCloseToFood, closeToFood)
      //     AI.tick(snakeCells2, food, updateBody, setSpeed,
      //       setSnake2, setDirection2, direction2, foodCheck, setCloseToFood2, closeToFood2)
      // }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food, direction2, playerSnakeArray]);

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
        if (prevDirection2.current !== "left") {
          updateFieldChanged(1, "direction", "right")
          socket.emit('updateDirection2', "right");
        }
        break
      case "a":
        if (prevDirection2.current !== "right") {
          updateFieldChanged(1, "direction", "left")
          socket.emit('updateDirection2', "left")
        }
        break
      case "s":
        if (prevDirection2.current !== "up") {
          updateFieldChanged(1, "direction", "down")
          socket.emit('updateDirection2', "down")
        }
        break
      case "w":
        if (prevDirection2.current !== "down") {
          updateFieldChanged(1, "direction", "up")
          socket.emit('updateDirection2', "up")
        }
        break
      default:
        break;
    }
  }

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        if (prevDirection.current !== "left") {
          updateFieldChanged(0, "direction", "right")
          socket.emit('updateDirection', "right")
        }
        break
      case "ArrowLeft":
        if (prevDirection.current !== "right") {
          updateFieldChanged(0, "direction", "left")
          socket.emit('updateDirection', "left")
        }
        break
      case "ArrowDown":
        if (prevDirection.current !== "up") {
          updateFieldChanged(0, "direction", "down")
          socket.emit('updateDirection', "down")
        }
        break
      case "ArrowUp":
        if (prevDirection.current !== "down") {
          updateFieldChanged(0, "direction", "up")
          socket.emit('updateDirection', "up")
        }
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

  // function headBodyCollisionCheck(snakeHead) {
  //   let snakeBody = snakeCells.slice(0, -1)

  //   if (helper.isArrayInArray(snakeBody, snakeHead)) {
  //     gameOver()
  //   }
  // }

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

  function handleCloseToFood(snakeHead, closeToFood, player) {
    let distanceX = Math.abs(food.x - snakeHead.x)
    let distanceY = Math.abs(food.y - snakeHead.y)

    if (distanceX < 12 && distanceY < 12) {
      console.log(closeToFood)
      if (!closeToFood) {
        playSound('mouth.mp3')
      }
      updateFieldChanged(player, "closeToFood", true)
    }
    else {
      updateFieldChanged(player, "closeToFood", false)

    }
  }

  function foodCheck(snakeHead, updatedCells, closeToFood, player) {
    handleCloseToFood(snakeHead, closeToFood, player)
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

  function tick(snakeCells, direction, closeToFood, player) {
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
      default:
        break;
    }

    outOfBoundsCheck(snakeHead)
    // headBodyCollisionCheck(snakeHead)
    foodCheck(snakeHead, updatedCells, closeToFood, player)

    if (player == 0) {
      updateFieldChanged(0, 'snakeCells', updatedCells)
      socket.emit('updateBody', updatedCells);
    }
    else {
      updateFieldChanged(1, 'snakeCells', updatedCells)
      socket.emit('updateBody2', updatedCells);
    }


  }

  return (
    <div>
      <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
      <ScoreBoard score={score} setAi={setAi} setAcronymStatus={setAcronymStatus} acronymStatus={acronymStatus} aiStatus={aiStatus} setVolume={setVolume} volume={volume} fullWord={currentAcronym.fullWord} />
      <div className="game-area">

        {playerSnakeArray.map(player => {
          return <Snake num={player.playerId} snake={player.snakeCells} speed={speed} direction={player.direction} closeToFood={player.closeToFood} isGameOver={isGameOver} />
        })}

        <Food food={food} confettiLocation={confettiLocation} currentAcronym={currentAcronym} showConfetti={showConfetti} acronymStatus={acronymStatus} />
      </div>
    </div>
  );
}

export default App;
