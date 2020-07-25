import React, { useState, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import GameOverScreen from './GameOverScreen'
import AI from './Ai'
import io from 'socket.io-client'
import GameMenu from './GameMenu'
import CanvasWrapper from './CanvasWrapper'
import KeyboardInput from './KeyboardInput'

let socket = null
const helper = require('./helper.js')
const acronyms = require('./acronyms.js')
const gamepad = require('./gamepad.js')

const App = () => {
  const randomLocation = () => {
    let x = Math.floor(Math.random() * 350)
    let y = Math.floor(Math.random() * 350)
    return { 'x': x, 'y': y }
  }

  const [score, setScore] = useState(0)
  const [food, setFood] = useState(randomLocation())
  const foodRef = useRef(food)

  const [volume, setVolume] = useState(0)
  const [isGameOver, setGameOver] = useState(false)
  const [showConfetti, setConfetti] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [gameMode, setGameMode] = useState("singlePlayer")
  const gameModeRef = useRef(gameMode)
  const [acronymMap, setAcronymsMap] = useState(acronyms)
  const [currentAcronym, setAcronym] = useState(helper.randomItem(acronymMap))
  const currentAcronymRef = useRef(currentAcronym)

  const [acronymStatus, setAcronymStatus] = useState(false)

  const [playerId, setPlayerId] = useState(0)
  const playerRef = useRef(playerId)

  const [playerSnakeArray, setPlayerSnakeArray] = useState([])
  const playerSnakeArrayRef = useRef(playerSnakeArray)

  let blockSize = 3

  useEffect(() => {
    window.addEventListener('keydown', keypress)
    return () => {
      window.removeEventListener('keydown', keypress)
    }
  }, [gameMode])


  useEffect(() => {
    if (gameModeRef.current == "multiplayer") {
      console.log(playerId, playerRef.current)
      updateFieldChanged(playerId, 'score', score)
      socket.emit('scoreUpdate', { playerId: playerId, score: score })
    }
  }, [score])
 

  useEffect(() => {
    if (gameMode == 'multiplayer') {
      socket = io.connect('http://192.168.1.11:3001/', { transports: ['websocket'], upgrade: false })
      socket.emit("startMultiplayer")
      socket.emit("getPlayerId")

      socket.on('playerJoined', (data) => {
        console.log("second player Joined")
        socket.emit("sync", { snakeArray: playerSnakeArrayRef.current, newId: data.newId })
      })

      socket.on('scoreUpdate', (data) => {
        updateFieldChanged(data.playerId, 'score', data.score)
     })

      socket.on('clear', (data) => {
        let x = playerSnakeArrayRef.current.filter(x => x.playerId != data.playerId)
        playerSnakeArrayRef.current = x
        setPlayerSnakeArray(x)
      })

      socket.on('playerKeyEvent', (data) => {
        updateFieldChanged(data.playerId, 'direction', data.direction)
      })

      socket.on('getPlayerId', (data) => {
        setPlayerId(data)
        playerRef.current = data
      })

      socket.on('getFood', (data) => {
        foodRef.current = data
        setFood(data)
      })
      socket.on('sendPlayerSnakeArray', (data) => {
        playerSnakeArrayRef.current = data
        setPlayerSnakeArray(data)
      })
      socket.on('updateBodyBroadcast', (data) => { updateFieldChanged(data.playerId, 'snakeCells', data.snakeCells) })
      socket.on('updateFoodBroadcast', (data) => {
        foodRef.current = data
        setFood(data)
      })
    }
  }, [gameStart])


  const requestRef = useRef()
  const previousTimeRef = useRef()

  const animate = time => {
    if (isGameOver) { cancelAnimationFrame(requestRef.current); return; }
    if (previousTimeRef.current != undefined) {
      draw(playerSnakeArrayRef.current)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [acronymStatus, isGameOver, gameMode])


  // useEffect(() => {
  //   if (gameMode == "multiplayer") {
  //     socket.emit('scoreUpdate', { playerId: playerId, score: score })
  //   }
  // }, [score])

  const keypress = ({ key }) => {
    if (gameMode == "singlePlayer")
      KeyboardInput.singlePlayerKeyPress(playerSnakeArrayRef, playerRef, updateFieldChanged, key)
    else {
      KeyboardInput.multiplayerKeyPress(playerSnakeArrayRef, playerRef, socket, updateFieldChanged, key)
    }
  }

  const updateFieldChanged = (playerId, prop, value) => {
    let newArr = [...playerSnakeArrayRef.current]
    if (!newArr.find(snake => snake.playerId == playerId))
      return;
    newArr.find(snake => snake.playerId == playerId)[prop] = value
    setPlayerSnakeArray(newArr)
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
    // setGameOver(true)
    // if (gameMode == "multiplayer")
    //   socket.disconnect()
    // playSound('game-over.mp3')
  }

  // const headBodyCollisionCheck = (snakeHead) => {
  //   let snakeBody = snakeCells.slice(0, -1)

  //   if (helper.isArrayInArray(snakeBody, snakeHead)) {
  //     gameOver()
  //   }
  // }

  const hasEatenFood = (snakeHead) => {
    return helper.headAtFood(snakeHead, foodRef.current)
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
    let distanceX = Math.abs(foodRef.current.x - snakeHead.x)
    let distanceY = Math.abs(foodRef.current.y - snakeHead.y)
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

  const foodCheck = (snakeHead, updatedCells, closeToFood, currentPlayerId) => {
    handleCloseToFood(snakeHead, closeToFood, currentPlayerId)
    if (hasEatenFood(snakeHead)) {
      setConfetti(true)
      if (gameModeRef.current == "singlePlayer") {
        setFood(randomLocation())
        foodRef.current = randomLocation()
      } else {
        socket.emit('randomFood')
      }

      if(playerRef.current == currentPlayerId )
        setScore(score => score + 1)

      let randomAcr = helper.randomItem(acronymMap)
      setAcronym(randomAcr)
      currentAcronymRef.current = randomAcr
      playSound('bling.mp3')
      increaseSnakeLength(updatedCells)
    }
    else {
      setConfetti(false)
    }
  }

  const renderFullWorld = (context) => {
    context.fillStyle = "white"
    context.font = "bold 25px Verdana"
    let acronymWidth = context.measureText(currentAcronymRef.current.acronym).width
    context.fillText(currentAcronymRef.current.acronym, foodRef.current.x * blockSize - (acronymWidth / 2) + 10, foodRef.current.y * blockSize - 20)

    context.font = "bold 25px Verdana"
    let fullWordWidth = context.measureText(currentAcronymRef.current.fullWord).width
    context.fillText(currentAcronymRef.current.fullWord, foodRef.current.x * blockSize - (fullWordWidth / 2) + 10, foodRef.current.y * blockSize + 60)
  }

  const renderFood = (context) => {
    context.beginPath();
    context.arc(foodRef.current.x * blockSize + 10, foodRef.current.y * blockSize + 10, 10, 0, 2 * Math.PI)
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

  const draw = (playerSnakeArray) => {
    const canvas = canvasRef.current
    if (!canvas || !playerSnakeArray)
      return;
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    renderGameBoard(context, canvas)
    renderFood(context)

    if (acronymStatus) {
      renderFullWorld(context)
    }

    playerSnakeArrayRef.current.forEach(snake => {
      let updatedCells = updateBody(snake.snakeCells)
      let snakeHead = updatedCells.slice(-1)[0]

      if (snake.aiStatus) {
        AI.moveToFood(foodRef.current, snakeHead, socket, snake.playerId, gameMode, updateFieldChanged)
      } else {
        switch (snake.direction) {
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
      }

      // headBodyCollisionCheck(snakeHead)
      foodCheck(snakeHead, updatedCells, snake.closeToFood, snake.playerId)
      updateFieldChanged(snake.playerId, 'snakeCells', updatedCells)

      snake.snakeCells.forEach((cell, index) => {
        context.fillStyle = gameModeRef.current == "singlePlayer" ? '#48df08' : `#${snake.colour}`
        context.fillRect(cell.x * blockSize, cell.y * blockSize, 20, 20)

        // GameOver
        if (snake.playerId == playerRef.current) {
          if (cell.x * 3 > canvas.width || cell.y * 3 > canvas.height) {
            gameOver()
          } else if (cell.x < 0 || cell.y < 0) {
            gameOver()
          }
        }

        //snake head
        if (index === snake.snakeCells.length - 1) {
          var snakeHead = new Image();
          snakeHead.src = !snake.closeToFood ? 'snake-head.png' : 'snake-head-eat.png';
          context.save();
          context.translate(cell.x * blockSize, cell.y * blockSize);

          //rotate head
          if (snake.direction == "up") {
            context.rotate(Math.PI);
            context.drawImage(snakeHead, -25, -3, 30, 40)
          } else if (snake.direction == "down") {
            context.rotate(0);
            context.drawImage(snakeHead, -5, 5, 30, 40)
          }
          else if (snake.direction == "left") {
            context.rotate(Math.PI / 2);
            context.drawImage(snakeHead, -5, -3, 30, 40)
          }
          else if (snake.direction == "right") {
            context.rotate(Math.PI * 3 / 2);
            context.drawImage(snakeHead, -25, 15, 30, 40)
          }
        }
      })
      context.restore()
    })
  }

  return (
    <div>
      {!gameStart ? <GameMenu gameStart={gameStart} setGameStart={setGameStart} socket={socket} setGameMode={setGameMode} setPlayerSnakeArray={setPlayerSnakeArray} gameModeRef={gameModeRef} playerSnakeArrayRef={playerSnakeArrayRef} /> :
        <div>
          <GameOverScreen isGameOver={isGameOver} setGameOver={setGameOver} />
          <TopBar score={score} socket={socket}
            setAcronymStatus={setAcronymStatus}
            acronymStatus={acronymStatus}
            setVolume={setVolume} volume={volume}
            fullWord={currentAcronym.fullWord}
            playerSnakeArray={playerSnakeArray}
            playerId={playerId}
            updateFieldChange={updateFieldChanged}
            gameMode={gameMode} />
          <CanvasWrapper food={foodRef.current} canvasRef={canvasRef} showConfetti={showConfetti} blockSize={blockSize} />
        </div>}
    </div>
  )
}

export default App
