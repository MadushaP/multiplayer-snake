import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen'
import AI from './Ai'
import io from 'socket.io-client';
const socket = io.connect('http://192.168.1.11:3001/')

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
  const [speed, setSpeed] = useState(500)
  const [aiStatus, setAi] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isGameOver, setGameOver] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const [confettiLocation, setConfettiLocation] = useState(food);

  const [acronymMap, setAcronymsMap] = useState(acronyms);
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const [acronymStatus, setAcronymStatus] = useState(false);
  const [playerId, setPlayerId] = useState(0);

   const [playerSnakeArray, setPlayerSnakeArray] = useState([]);

   const prevDirection = usePrevious("UNKNOWN")

  const updateFieldChanged = (playerId, prop, value) => {
    let newArr = [...playerSnakeArray];
    newArr[playerId][prop] = value;

    setPlayerSnakeArray(newArr);
  }


  useEffect(() => {
    window.addEventListener('keydown', keypress)
    socket.emit('getPlayerSnakeArray')
    socket.on('getFood', (data) => { setFood(data) })

    socket.on('sendPlayerSnakeArray', (data) => {  setPlayerSnakeArray(data)  })

    // socket.on('updateDirectionBroadcast', (data) => { updateFieldChanged(data.playerId, 'direction', data.direction) })
    socket.on('updateBodyBroadcast', (data) => {  updateFieldChanged(data.playerId, 'snakeCells', data.snakeCells)})
    socket.on('updateFoodBroadcast', (data) => { setFood(data) })

     
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;
      if (!aiStatus) {

        playerSnakeArray.forEach((player, index) => tick(player.snakeCells, player.direction, player.closeToFood, index))
  
      }
      // } else {
      //   AI.tick(snakeCells, food, updateBody, setSpeed,
      //     setSnake, setDirection, direction, foodCheck, setCloseToFood, closeToFood)
      //     AI.tick(snakeCells2, food, updateBody, setSpeed,
      //       setSnake2, setDirection2, direction2, foodCheck, setCloseToFood2, closeToFood2)
      // }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, food, playerSnakeArray, playerId]);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes

    return ref;
  }

  function keypress({ key }) {

    switch (key) {      
      case "ArrowRight":
        if (prevDirection.current !== "left") {
          socket.emit('getPlayerId')
          socket.on('getPlayerId', (data) => { 
            socket.emit('setPlayerSnakeArray', {'playerId': data, 'prop':'direction', 'value': "right"})
          })
        }
        break
      case "ArrowLeft":
        if (prevDirection.current !== "right") {
          socket.emit('getPlayerId')
          socket.on('getPlayerId', (data) => { 
            socket.emit('setPlayerSnakeArray', {'playerId': data, 'prop':'direction', 'value': "left"})
          })
              }
        break
      case "ArrowDown":
        if (prevDirection.current !== "up") {
          socket.emit('getPlayerId')
          socket.on('getPlayerId', (data) => { 
            socket.emit('setPlayerSnakeArray', {'playerId': data, 'prop':'direction', 'value': "down"})
          })
        }
        break
      case "ArrowUp":
        if (prevDirection.current !== "down") {
          socket.emit('getPlayerId')
          socket.on('getPlayerId', (data) => { 
            socket.emit('setPlayerSnakeArray', {'playerId': data, 'prop':'direction', 'value': "up"})
          })
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

  function handleCloseToFood(snakeHead, closeToFood, playerId) {
    let distanceX = Math.abs(food.x - snakeHead.x)
    let distanceY = Math.abs(food.y - snakeHead.y)

    if (distanceX < 12 && distanceY < 12) {
      if (!closeToFood) {
        playSound('mouth.mp3')
      }
      socket.emit('setPlayerSnakeArray', {'playerId': playerId, 'prop':'closeToFood', 'value': true})
    }
    else {
      socket.emit('setPlayerSnakeArray', {'playerId': playerId, 'prop':'closeToFood', 'value': false})
    }
  }

  function foodCheck(snakeHead, updatedCells, closeToFood, playerId) {
    handleCloseToFood(snakeHead, closeToFood, playerId)
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

  function tick(snakeCells, direction, closeToFood, playerId) {
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
    foodCheck(snakeHead, updatedCells, closeToFood, playerId)
    socket.emit('setPlayerSnakeArray', {'playerId': playerId, 'prop':'snakeCells', 'value': updatedCells})

  }

  return (
    <div>
      <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
      <ScoreBoard score={score} setAi={setAi} setAcronymStatus={setAcronymStatus} acronymStatus={acronymStatus} aiStatus={aiStatus} setVolume={setVolume} volume={volume} fullWord={currentAcronym.fullWord} />
      <div className="game-area">

        {playerSnakeArray.map((player, index) => {
          return <Snake playerId={index} snake={player.snakeCells} speed={speed} direction={player.direction} closeToFood={player.closeToFood} isGameOver={isGameOver} colour={player.colour} />
        })}

        <Food food={food} confettiLocation={confettiLocation} currentAcronym={currentAcronym} showConfetti={showConfetti} acronymStatus={acronymStatus} />
      </div>
    </div>
  );
}

export default App;
