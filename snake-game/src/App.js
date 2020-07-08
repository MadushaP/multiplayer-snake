import React, { useState, useEffect, useRef } from 'react'
import ScoreBoard from './ScoreBoard'
import GameOverScreen from './GameOverScreen'
import AI from './Ai'
import io from 'socket.io-client'
import GameMenu from './GameMenu'
import ConfettiWrapper from './ConfettiWrapper'

const socket = io.connect('http://192.168.1.11:3001/', { transports: ['websocket'], upgrade: false })

const helper = require('./helper.js')
const acronyms = require('./acronyms.js')
const gamepad = require('./gamepad.js')

const randomLocation = () => {
  let x = Math.floor(Math.random() * 350)
  let y = Math.floor(Math.random() * 350)
  return { 'x': x, 'y': y }
}

const App = () => {
  const [score, setScore] = useState(0)
  const [food, setFood] = useState(randomLocation())
  const [speed, setSpeed] = useState(100)
  const [aiStatus, setAi] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isGameOver, setGameOver] = useState(false)
  const [showConfetti, setConfetti] = useState(false)
  const [confettiLocation, setConfettiLocation] = useState(food)
  const [gameStart, setGameStart] = useState(false)
  const [gameMode, setGameMode] = useState("singlePlayer")
  const gameModeRef = useRef(gameMode)

  const [acronymMap, setAcronymsMap] = useState(acronyms)
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const [acronymStatus, setAcronymStatus] = useState(false)

  const [playerId, setPlayerId] = useState(0)
  const playerRef = useRef(playerId)

  const [playerSnakeArray, setPlayerSnakeArray] = useState([{
    playerId: 0,
    snakeCells: [
      { 'x': 10, 'y': 10 },
      { 'x': 12, 'y': 10 },
      { 'x': 14, 'y': 10 },
      { 'x': 16, 'y': 10 },
    ],
    direction: "right",
    closeToFood: false,
    aiStatus: false,
  }])
  const playerSnakeArrayRef = useRef(playerSnakeArray)

  let blockSize = 3

  const updateFieldChanged = (playerId, prop, value) => {
    if (gameModeRef.current == "singlePlayer") {
      let newArr = [...playerSnakeArrayRef.current]
      newArr[0][prop] = value
      setPlayerSnakeArray(newArr)
    } else {
      if (prop == "direction") {
        socket.emit('updateDirection', { 'playerId': playerId, 'direction': value })
      } else {
        socket.emit('setPlayerSnakeArray', { 'playerId': playerId, 'prop': prop, 'value': value })
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keypress)
    return () => {
      window.removeEventListener('keydown', keypress)
    }
  }, [])

  useEffect(() => {
    if (gameMode == 'multiplayer') {

      socket.emit("startMultiplayer")
      socket.emit("getPlayerId")

      socket.on('getPlayerId', (data) => {
        console.log("player ID:", data)
        setPlayerId(data)
        playerRef.current = data
      })

      socket.on('getFood', (data) => { setFood(data) })
      socket.on('sendPlayerSnakeArray', (data) => {
        playerSnakeArrayRef.current = data
        setPlayerSnakeArray(data)
      })
      socket.on('updateBodyBroadcast', (data) => { updateFieldChanged(data.playerId, 'snakeCells', data.snakeCells) })
      socket.on('updateFoodBroadcast', (data) => { setFood(data) })
    }
  }, [gameMode])



  const requestRef = React.useRef()
  const previousTimeRef = React.useRef()

  const animate = time => {
    // if (isGameOver || !gameStart) { cancelAnimationFrame(requestRef.current); return; }
    if (isGameOver) { cancelAnimationFrame(requestRef.current); return; }

    if (previousTimeRef.current != undefined) {
      playerSnakeArrayRef.current.forEach((player) => {
        if (!player.aiStatus) {
          tick(player.snakeCells, player.direction, player.closeToFood, player.playerId)
        } else {
          AI.tick(player.snakeCells, player.direction, player.closeToFood, foodCheck, player.playerId, setSpeed, updateBody, food, socket, gameMode, updateFieldChanged, draw)
        }
      })
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate)
  }


  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [speed, food, playerSnakeArray, playerId, isGameOver])

  const keypress = ({ key }) => {
    //When still in menu disable keyboard input
    if (playerSnakeArrayRef.current.length == 0)
      return

    let currentDirection = playerSnakeArrayRef.current.find(x => x.playerId == playerRef.current).direction
    switch (key) {
      case "ArrowRight":
        if (currentDirection !== "left") {
          updateFieldChanged(playerRef.current, 'direction', "right")
        }
        break
      case "ArrowLeft":
        if (currentDirection !== "right") {
          updateFieldChanged(playerRef.current, 'direction', "left")
        }
        break
      case "ArrowDown":
        if (currentDirection !== "up") {
          updateFieldChanged(playerRef.current, 'direction', "down")
        }
        break
      case "ArrowUp":
        if (currentDirection !== "down") {
          updateFieldChanged(playerRef.current, 'direction', "up")
        }
        break
      default:
        break
    }
  }


  const updateBody = (snakeCells) => {
    let updatedCells = [...snakeCells]
    for (let cell = 0; cell < updatedCells.length - 1; cell++) {
      updatedCells[cell].x = snakeCells[cell + 1].x
      updatedCells[cell].y = snakeCells[cell + 1].y
    }

    return updatedCells
  }

  const gameOver = () => {
    setGameOver(true)
    socket.disconnect()
    playSound('game-over.mp3')
  }

  // const headBodyCollisionCheck = (snakeHead) => {
  //   let snakeBody = snakeCells.slice(0, -1)

  //   if (helper.isArrayInArray(snakeBody, snakeHead)) {
  //     gameOver()
  //   }
  // }

  const hasEatenFood = (snakeHead) => {
    return helper.headAtFood(snakeHead, food)
  }

  const playSound = (sound) => {
    var bloop = new Audio(sound)
    bloop.volume = volume
    bloop.play()
  }

  const increaseSnakeLength = (updatedCells) => {
    let snakeTail = updatedCells[0]

    for (let i = 0; i < 4; i++) {
      updatedCells.unshift({ 'x': snakeTail.x, 'y': snakeTail.y })
    }
  }

  const handleCloseToFood = (snakeHead, closeToFood, playerId) => {
    let distanceX = Math.abs(food.x - snakeHead.x)
    let distanceY = Math.abs(food.y - snakeHead.y)
    if (distanceX < 12 * blockSize && distanceY < 12 * blockSize) {
      if (!closeToFood) {
        playSound('mouth.mp3')
      }
      updateFieldChanged(playerId, 'closeToFood', true)

    }
    else {
      updateFieldChanged(playerId, 'closeToFood', false)
    }
  }

  const foodCheck = (snakeHead, updatedCells, closeToFood, playerId) => {
    handleCloseToFood(snakeHead, closeToFood, playerId)
    if (hasEatenFood(snakeHead)) {
      setConfettiLocation({ 'x': snakeHead.x, 'y': snakeHead.y })
      setConfetti(true)
      if (gameMode == "singlePlayer") {
        setFood(randomLocation())
      } else {
        socket.emit('randomFood')
      }

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

  const tick = (snakeCells, direction, closeToFood, playerId) => {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = updatedCells.slice(-1)[0]

    switch (direction) {
      case "right":
        snakeHead.x += 2
        break
      case "left":
        snakeHead.x -= 2
        break
      case "down":
        snakeHead.y += 2
        break
      case "up":
        snakeHead.y -= 2
        break
      default:
        break
    }
    // outOfBoundsCheck(snakeHead, playerId)
    // headBodyCollisionCheck(snakeHead)
    foodCheck(snakeHead, updatedCells, closeToFood, playerId)

    updateFieldChanged(playerId, 'snakeCells', updatedCells)
    draw(updatedCells, closeToFood)

  }

  const renderFullWorld = (context) => {
    context.fillStyle = "white"
    context.font = "bold 25px Verdana"
    let acronymWidth = context.measureText(currentAcronym.acronym).width
    context.fillText(currentAcronym.acronym, food.x * blockSize - (acronymWidth / 2) + 10, food.y * blockSize - 20)

    context.font = "bold 25px Verdana"
    let fullWordWidth = context.measureText(currentAcronym.fullWord).width
    context.fillText(currentAcronym.fullWord, food.x * blockSize - (fullWordWidth / 2) + 10, food.y * blockSize + 60)
  }

  const renderFood = (context) => {
    context.beginPath();
    context.arc(food.x * blockSize + 10, food.y * blockSize + 10, 10, 0, 2 * Math.PI)
    context.fillStyle = "#FF0000"
    context.fill();
    context.stroke();
  }

  const renderGameBoard = (context, canvas) => {
    var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, "#0e6ef0");
    grd.addColorStop(1, "#004CB3");
    context.fillStyle = grd;
    context.fillRect(0, 0, 1300, 1175)
  }

  const canvasRef = useRef(null)

  const draw = (snake, closeToFood) => {
    const canvas = canvasRef.current
    if (!canvas || !snake)
      return;
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    //game board
    renderGameBoard(context, canvas)

    //food
    renderFood(context)

    if (acronymStatus) {
      renderFullWorld(context)
    }

    //render snake
    snake.forEach((cell, index) => {
      context.fillStyle = "#48df08";
      context.fillRect(cell.x * blockSize, cell.y * blockSize, 20, 20)
      context.save();

      //GameOver
      if (cell.x * 3 > canvas.width || cell.y * 3 > canvas.height) {
        setGameOver(true)
      } else if (cell.x < 0 || cell.y < 0) {
        setGameOver(true)
      }


      //snake head
      if (index === snake.length - 1) {
        var snakeHead = new Image();
        snakeHead.src = !closeToFood ? 'snake-head.png' : 'snake-head-eat.png';
        context.translate(cell.x * blockSize, cell.y * blockSize);

        //rotate head
        if (playerSnakeArrayRef.current[0].direction == "up") {
          context.rotate(Math.PI);
          context.drawImage(snakeHead, -25, -3, 30, 40)
        } else if (playerSnakeArrayRef.current[0].direction == "down") {
          context.rotate(0);
          context.drawImage(snakeHead, -5, 5, 30, 40)
        }
        else if (playerSnakeArrayRef.current[0].direction == "left") {
          context.rotate(Math.PI / 2);
          context.drawImage(snakeHead, -5, -3, 30, 40)
        }
        else if (playerSnakeArrayRef.current[0].direction == "right") {
          context.rotate(Math.PI * 3 / 2);
          context.drawImage(snakeHead, -25, 15, 30, 40)
        }

        context.restore()
      }
    })
  }

  return (
    <div>
      {gameStart ? <GameMenu gameStart={gameStart} setGameStart={setGameStart} socket={socket} setGameMode={setGameMode} setPlayerSnakeArray={setPlayerSnakeArray} gameModeRef={gameModeRef} playerSnakeArrayRef={playerSnakeArrayRef} /> :
        <div>
          <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
          <ScoreBoard score={score} socket={socket} setAcronymStatus={setAcronymStatus} acronymStatus={acronymStatus} setVolume={setVolume} volume={volume} fullWord={currentAcronym.fullWord} playerSnakeArray={playerSnakeArray} playerId={playerId} updateFieldChange={updateFieldChanged} gameMode={gameMode} />
          <ConfettiWrapper food={food} canvasRef={canvasRef} showConfetti={showConfetti} blockSize={blockSize} />
        </div>}
    </div>
  )
}

export default App
