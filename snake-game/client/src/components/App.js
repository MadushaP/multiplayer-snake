import React, { useState, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import GameOverScreen from './GameOverScreen'
import AI from '../lib/Ai'
import io from 'socket.io-client'
import GameMenu from './GameMenu'
import CanvasWrapper from './CanvasWrapper'
import KeyboardInput from '../lib/KeyboardInput'
import Sound, { playSound } from '../lib/Sound'
import { SnakeImage, Powers } from '../assets/images/'

let socket = null
const { randomItem, headAtFood, isArrayInArray, randomLocation } = require('../lib/helper.js')
const acronyms = require('../store/acronyms.js')
const gamepad = require('../lib/gamepad.js')

const App = () => {
  const [score, setScore] = useState(0)
  const [food, setFood] = useState(randomLocation())
  const foodRef = useRef(food)

  const [powerUpText, setPowerText] = useState()

  const [powerUp, setPowerUp] = useState()
  const powerUpRef = useRef(powerUp)

  const [bullet, setBullet] = useState({
    playerId: null,
    direction: false,
    location: { x: 0, y: 0 },
    moving: false,
    bulletFired: false,
    muzzleFlare: false,
    blood: false,
    hitSound: false
  })
  const bulletRef = useRef(bullet)

  const [volume, setVolume] = useState(0.8)
  const [isGameOver, setGameOver] = useState(false)
  const [showConfetti, setConfetti] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [gameMode, setGameMode] = useState("singlePlayer")
  const gameModeRef = useRef(gameMode)
  const [acronymMap, setAcronymsMap] = useState(acronyms)
  const [currentAcronym, setAcronym] = useState(randomItem(acronymMap))
  const currentAcronymRef = useRef(currentAcronym)
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
    colour: '48df08',
    score: 0,
    status: 'none'
  }])
  const [speed, setSpeed] = useState(5)
  const speedRef = useRef(speed)
  const [isNewLevel, setIsNewLevel] = useState(false)
  const [pause, setPause] = useState(false)
  const playerSnakeArrayRef = useRef(playerSnakeArray)

  const [shade, setShade] = useState(0)
  const shadeRef = useRef(shade)

  useEffect(() => {
    window.addEventListener('keydown', keypress)
    return () => {
      window.removeEventListener('keydown', keypress)
    }
  }, [gameMode])

  useEffect(() => {
    if (gameMode == "multiplayer" && isGameOver)
      socket.disconnect()
  }, [isGameOver])

  const keypress = ({ key }) => {
    if (gameMode == "singlePlayer" || gameMode == "vsCPU")
      KeyboardInput.singlePlayerKeyPress(playerSnakeArrayRef, playerRef, updateSnakeArray, key)
    else {
      KeyboardInput.multiplayerKeyPress(playerSnakeArrayRef, playerRef, socket, updateSnakeArray, key)
    }
  }

  useEffect(() => {

    if (gameMode == 'multiplayer') {
      socket = io.connect('http://localhost:3001/', { transports: ['websocket'], upgrade: false })
      socket.emit("startMultiplayer")
      socket.emit("getPlayerId")
      socket.on('playerJoined', (data) => {
        console.log("Player Joined")
        socket.emit("syncNewPlayer", { snakeArray: playerSnakeArrayRef.current, newId: data.newId })
      })

      socket.on('scoreUpdate', (data) => {
        updateSnakeArray(data.playerId, 'score', data.score)
      })

      socket.on('clear', (data) => {
        let x = playerSnakeArrayRef.current.filter(x => x.playerId != data.playerId)
        playerSnakeArrayRef.current = x
        setPlayerSnakeArray(x)
      })

      socket.on('playerKeyEvent', (data) => {
        updateSnakeArray(data.playerId, 'direction', data.direction)
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

      socket.on('updateBodyBroadcast', (data) => { updateSnakeArray(data.playerId, 'snakeCells', data.snakeCells) })
      socket.on('updateFoodBroadcast', (data) => {
        foodRef.current = data
        setFood(data)
      })

      socket.on('increaseSnakeLength', (data) => {
        increaseSnakeLength(data.updatedCells)
        updateSnakeArray(data.playerId, 'snakeCells', data.updatedCells)
      })

      socket.on('powerUpChange', (data) => {
        powerUpRef.current = data
      })

      socket.on('freeze', (data) => {
        if (playerRef.current != data.playerId) {
          setPowerText("frozen")
          Sound.playSound('holy-shit.mp3', false, 0.2)
        }

        playerSnakeArrayRef.current.forEach(snake => {
          if (snake.playerId != data.playerId) {
            updateSnakeArray(snake.playerId, 'status', 'frozen')
            setInterval(() => { updateSnakeArray(snake.playerId, 'status', 'none') }, 7000)
          }
        })
      })

      socket.on('loadGun', (data) => {
        if (playerRef.current == data.playerId)
          setPowerText("gun")
        updateSnakeArray(data.playerId, 'status', 'gun')
      })

      socket.on('fireBullet', (data) => {
        updateSnakeArray(data.playerId, 'status', 'none')
        bulletRef.current.status = true
        bulletRef.current.playerId = data.playerId
      })
    }

    // if (gameStart)
    //   Sound.playSound('background-music.mp3', true, 0.3)
  }, [gameStart])

  useEffect(() => {
    if (gameModeRef.current == "multiplayer") {
      updateSnakeArray(playerId, 'score', score)
      socket.emit('scoreUpdate', { playerId: playerId, score: score })
    } else if (gameModeRef.current == "singlePlayer") {
      levelUpCheck(score)
    }
  }, [score])

  const levelUp = (speed) => {
    speedRef.current = speed
    Sound.playSound('level-up.mp3', false, 0.5)
    setIsNewLevel(true)
  }

  const levelUpCheck = (score) => {
    switch (score) {
      case 5:
        levelUp(7)
        break
      case 10:
        levelUp(10)
        break
      case 15:
        levelUp(12)
        break
      case 25:
        levelUp(14)
        break
      case 30:
        levelUp(16)
        break
      case 40:
        levelUp(20)
        break
    }
  }

  const requestRef = useRef()
  const previousTimeRef = useRef()

  const animate = time => {
    if (isGameOver || pause) { cancelAnimationFrame(requestRef.current); return; }
    if (previousTimeRef.current != undefined) {
      draw(playerSnakeArrayRef.current)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [acronymStatus, isGameOver, volume, pause])

  const updateSnakeArray = (playerId, prop, value) => {
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
    setGameOver(true)
    Sound.playSound('game-over.mp3', false, 0.2)
  }

  const headBodyCollisionCheck = (snakeHead, snakeCells) => {
    let snakeBody = snakeCells.slice(0, -1)
    if (isArrayInArray(snakeBody, snakeHead)) {
      gameOver()
    }
  }

  const hasEatenFood = (snakeHead) => {
    return headAtFood(snakeHead, foodRef.current)
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
    if (distanceX < 100 && distanceY < 100) {
      if (!closeToFood) {
        Sound.playSound('mouth.mp3')
      }
      updateSnakeArray(playerId, 'closeToFood', true)
    }
    else {
      updateSnakeArray(playerId, 'closeToFood', false)
    }
  }

  const foodCheck = (snakeHead, updatedCells, closeToFood, currentPlayerId, score) => {
    handleCloseToFood(snakeHead, closeToFood, currentPlayerId)
    if (hasEatenFood(snakeHead)) {
      setConfetti(true)
      if (gameModeRef.current == "singlePlayer" || gameModeRef.current == "vsCPU") {
        let foodLocation = randomLocation()
        setFood(foodLocation)
        foodRef.current = foodLocation
        updateSnakeArray(currentPlayerId, 'score', score + 1)
        setScore(score => score + 1)
        increaseSnakeLength(updatedCells)
      } else if (gameModeRef.current == "multiplayer") {
        socket.emit('randomFood')
        updateSnakeArray(currentPlayerId, 'score', score + 1)
        socket.emit('scoreUpdate', { playerId: currentPlayerId, score: score + 1 })
        socket.emit('increaseSnakeLength', { playerId: currentPlayerId, updatedCells: updatedCells })
        increaseSnakeLength(updatedCells)
      }

      let randomAcr = randomItem(acronymMap)
      setAcronym(randomAcr)
      currentAcronymRef.current = randomAcr
      Sound.playSound('bling.mp3', false, 0.3)
    }
    else {
      setConfetti(false)
    }
  }

  const powerUpCheck = (snakeHead, playerId) => {
    if (powerUpRef.current && gameModeRef.current == "multiplayer") {
      let distanceX = Math.abs(snakeHead.x - powerUpRef.current.location.x)
      let distanceY = Math.abs(snakeHead.y - powerUpRef.current.location.y)
      // console.log(snakeHead, powerUpRef.current, distanceX, distanceY)

      if (distanceX <= 39 && distanceY <= 39) {
        console.log(powerUpRef.current)
        if (powerUpRef.current.power == "freeze") {
          Sound.playSound('freeze-sound.mp3', false, 0.3)
          socket.emit('powerExecute', { playerId: playerId, status: 'freeze' })
        } else if (powerUpRef.current.power == "gun") {
          Sound.playSound('gun.mp3', false, 0.5)
          socket.emit('powerExecute', { playerId: playerId, status: 'gun' })
        }

      }
    }
  }

  const renderFullWorld = (context) => {
    context.fillStyle = "white"
    context.font = "bold 25px Verdana"
    let acronymWidth = context.measureText(currentAcronymRef.current.acronym).width
    context.fillText(currentAcronymRef.current.acronym, foodRef.current.x - (acronymWidth / 2) + 10, foodRef.current.y - 20)

    context.font = "bold 25px Verdana"
    let fullWordWidth = context.measureText(currentAcronymRef.current.fullWord).width
    context.fillText(currentAcronymRef.current.fullWord, foodRef.current.x - (fullWordWidth / 2) + 10, foodRef.current.y + 60)
  }

  const renderFood = (context) => {
    context.beginPath();

    context.shadowBlur = 10;
    context.shadowColor = "red";
    context.arc(foodRef.current.x + 10, foodRef.current.y + 10, 10, 0, 2 * Math.PI)
    context.fillStyle = "#FF0000"
    context.fill();
    context.shadowBlur = 0;
  }

  const renderPowerUp = (context) => {
    if (powerUpRef.current) {
      var powerUpImage = new Image();
      if (powerUpRef.current.power == "gun") {
        powerUpImage.src = Powers.gun
      } else {
        var powerUpImage = new Image();
        powerUpImage.src = Powers.freeze
      }

      context.shadowBlur = 10;
      context.shadowColor = "white";
      context.drawImage(powerUpImage, powerUpRef.current.location.x, powerUpRef.current.location.y, 60, 60)
      context.shadowBlur = 0;
    }
  }

  const renderGameBoard = (context, canvas) => {
    var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    grd.addColorStop(0, "#2680F9");
    grd.addColorStop(1, "#00285D");
    context.fillStyle = grd;
    context.fillRect(0, 0, 1300, 1175)
  }

  const selectHeadImage = (snake) => {
    if (!snake.closeToFood) {
      switch (snake.colour) {
        case "48df08":
          return SnakeImage.closedMouthColour.green
        case "5CFFE7":
          return SnakeImage.closedMouthColour.blue
        case "C70039":
          return SnakeImage.closedMouthColour.red
        case "DAF7A6":
          return SnakeImage.closedMouthColour.cream
        case "DEDEDE":
          return SnakeImage.closedMouthColour.grey
        case "FFC300":
          return SnakeImage.closedMouthColour.yellow
      }
    } else {
      switch (snake.colour) {
        case "48df08":
          return SnakeImage.openMouthColour.green
        case "5CFFE7":
          return SnakeImage.openMouthColour.blue
        case "C70039":
          return SnakeImage.openMouthColour.red
        case "DAF7A6":
          return SnakeImage.openMouthColour.cream
        case "DEDEDE":
          return SnakeImage.openMouthColour.grey
        case "FFC300":
          return SnakeImage.openMouthColour.yellow
      }
    }
  }

  const renderAiGuide = (context, snakeHead, direction) => {
    context.beginPath();
    context.setLineDash([32, 32, 32, 32]);
    context.shadowBlur = 8;
    context.shadowColor = "white";
    let grad = context.createLinearGradient(snakeHead.x, snakeHead.y, 500, 550);
    grad.addColorStop(0, "#45ec3f");
    grad.addColorStop(1, "#FF4500");
    context.strokeStyle = grad;
    context.lineWidth = 5
    if (direction == "right" || direction == "left") {
      context.moveTo(snakeHead.x + 10, snakeHead.y + 10)
      context.lineTo(foodRef.current.x + 10, snakeHead.y + 10)
      context.lineTo(foodRef.current.x + 10, foodRef.current.y + 10)
    } else {
      if (direction == "down") {
        context.moveTo(snakeHead.x + 10, snakeHead.y + 25)
      } else if (direction == "up") {
        context.moveTo(snakeHead.x + 10, snakeHead.y - 25)
      }
      context.lineTo(snakeHead.x + 10, foodRef.current.y + 10,)
      context.lineTo(foodRef.current.x + 10, foodRef.current.y + 10)
    }

    context.stroke();
    context.setLineDash([]);
    context.shadowBlur = 0;
  }

  function shadeColor(color, percent) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  const renderTail = (context, snake, cell, shadeCol) => {
    console.log(snake.direction)
    context.beginPath()
    switch (snake.direction) {
      case "left":
        context.arc(cell.x + 15, cell.y + 10, 10, 0, 2 * Math.PI)
        break
      case "right":
        context.arc(cell.x + 5, cell.y + 10, 10, 0, 2 * Math.PI)
        break
      case "up":
        context.arc(cell.x + 10, cell.y + 15, 10, 0, 2 * Math.PI)
        break
      case "down":
        context.arc(cell.x + 10, cell.y, 10, 0, 2 * Math.PI)
        break
    }

    context.fillStyle = shadeCol
    context.fill()
  }

  const renderBlood = (context, x, y, size) => {
    if (bulletRef.current.blood) {
      if (!bulletRef.current.hitSound) {
        Sound.playSound('bullet-hit.m4a', false, 0.5)
        setTimeout(() => { bulletRef.current.hitSound = true }, 10)
      }

      var bloodImage = new Image()
      bloodImage.src = Powers.blood
      context.drawImage(bloodImage, x, y, size, size)
    }
  }

  const renderFlash = (context) => {
    if (bulletRef.current.muzzleFlare) {
      context.shadowBlur = 40
      context.shadowColor = "orange"
      var flare = new Image()
      flare.src = Powers.flare
      context.drawImage(flare, -65, 0, 150, 175)
    }
  }
  const renderBullet = (context, snake, snakeHead) => {

    context.save()
    if (bulletRef.current.status == true && bulletRef.current.playerId == snake.playerId) {

      //Initialise bullet location
      if (bulletRef.current.moving == false) {
        bulletRef.current.location.x = snakeHead.x
        bulletRef.current.location.y = snakeHead.y
        bulletRef.current.direction = snake.direction

        if (bulletRef.current.direction == "left")
          bulletRef.current.location.x -= 50
        else if (bulletRef.current.direction == "right")
          bulletRef.current.location.x += 50
        else if (bulletRef.current.direction == "down")
          bulletRef.current.location.y += 50
        else
          bulletRef.current.location.y -= 50

        Sound.playSound('gunshot.mp3', false, 0.1)
        bulletRef.current.muzzleFlare = true
        setTimeout(() => {
          bulletRef.current.muzzleFlare = false
        }, 60)

        //reset state
        updateSnakeArray(snake.playerId, 'status', 'none')

        setTimeout(() => {
          bulletRef.current.status = false
          bulletRef.current.moving = false
          bulletRef.current.muzzleFlare = false
        }, 2000)

      }

      context.translate(bulletRef.current.location.x, bulletRef.current.location.y)

      var bulletImage = new Image()
      bulletImage.src = Powers.bullet
      context.shadowBlur = 5
      context.shadowColor = "white"

      switch (bulletRef.current.direction) {
        case "up":
          renderBlood(context, -50, -75, 170)
          context.rotate(Math.PI)
          context.drawImage(bulletImage, -35, -3, 50, 50)
          break
        case "down":
          renderBlood(context, -70, -75, 170)
          context.rotate(0)
          context.drawImage(bulletImage, -15, 5, 50, 50)
          break
        case "left":
          renderBlood(context, -100, -75, 170)
          context.rotate(Math.PI / 2)
          context.drawImage(bulletImage, -15, -3, 50, 50)
          break
        case "right":
          renderBlood(context, -20, -75, 170)
          context.scale(1, -1)
          context.rotate(Math.PI * 3 / 2)
          context.drawImage(bulletImage, -15, 15, 50, 50)
          break
      }

      renderFlash(context)
      //Move bullet
      if (bulletRef.current.moving == false) {
        bulletRef.current.moving = true

        var timesRun = 0
        let interval = setInterval(() => {
          timesRun += 1
          if (timesRun == 150)
            clearInterval(interval)

          switch (bulletRef.current.direction) {
            case "up":
              bulletRef.current.location.y -= 10
              break
            case "down":
              bulletRef.current.location.y += 10
              break
            case "left":
              bulletRef.current.location.x -= 10
              break
            case "right":
              bulletRef.current.location.x += 10
              break
          }


          //Bullet collision detection
          playerSnakeArrayRef.current.forEach(snake => {
            snake.snakeCells.forEach(cell => {
              let distanceX = Math.abs(cell.x - bulletRef.current.location.x)
              let distanceY = Math.abs(cell.y - bulletRef.current.location.y)

              if (distanceX < 30 && distanceY < 30) {
                bulletRef.current.blood = true

                setTimeout(() => {
                  bulletRef.current.status = false
                  bulletRef.current.blood = false
                }, 350)

                setTimeout(() => {
                  if (snake.playerId == playerRef.current) {
                    gameOver()
                  }
                }, 100)
                clearInterval(interval)
              }
            })
          })

        }, 10)
      }
    }
    context.restore()
  }

  const renderLaser = (context, snake, snakeHead) => {
    context.shadowBlur = 15
    context.shadowColor = "red"
    context.strokeStyle = "#FF1919";
    context.lineWidth = 2;

    if (snake.direction == "up") {
      context.beginPath();
      context.moveTo(snakeHead.x - 8, snakeHead.y + 53);
      context.lineTo(snakeHead.x - 8, snakeHead.y + 2000);
      context.stroke();
    } else if (snake.direction == "down") {
      context.beginPath();
      context.moveTo(snakeHead.x + 10, snakeHead.y + 57);
      context.lineTo(snakeHead.x + 10, snakeHead.y + 2000);
      context.stroke();
    }
    else if (snake.direction == "left") {
      context.beginPath();
      context.moveTo(snakeHead.x + 10, snakeHead.y + 50);
      context.lineTo(snakeHead.x + 10, snakeHead.y + 2000);
      context.stroke();
    }
    else if (snake.direction == "right") {
      context.beginPath();
      context.moveTo(snakeHead.x + 10, snakeHead.y + 65);
      context.lineTo(snakeHead.x + 10, snakeHead.y + 2000);
      context.stroke();
    }
  }

  const renderSnake = (context, index, snake, cell) => {
    let shadeCol = shadeColor('#48df08', shadeRef.current)
    // if (index == 0) {
    //   renderTail(context, snake, cell, shadeCol)
    // }

    if (shadeRef.current < 0 && index > (snake.snakeCells.length * 0.2)) {
      shadeRef.current += 0.8
    }

    context.fillStyle = gameModeRef.current == "singlePlayer" ? shadeCol : `#${snake.colour}`
    context.fillRect(cell.x, cell.y, 20, 20)

    if (snake.status == "frozen") {
      context.shadowBlur = 20
      context.shadowColor = "blue"
    }

    if (index === snake.snakeCells.length - 1) {
      shadeRef.current = -10
      var snakeHead = new Image()

      context.save()
      context.translate(cell.x, cell.y)

      if (snake.status != "gun") {
        snakeHead.src = selectHeadImage(snake)
        switch (snake.direction) {
          case "right":
            context.rotate(Math.PI * 3 / 2)
            context.drawImage(snakeHead, -25, 15, 30, 40)
            break
          case "left":
            context.rotate(Math.PI / 2)
            context.drawImage(snakeHead, -5, -3, 30, 40)
            break
          case "down":
            context.rotate(0)
            context.drawImage(snakeHead, -5, 5, 30, 40)
            break
          case "up":
            context.rotate(Math.PI)
            context.drawImage(snakeHead, -25, -3, 30, 40)
            break
        }
      } else {
        context.shadowBlur = 8
        context.shadowColor = "white"
        snakeHead.src = Powers.bullet

        switch (snake.direction) {
          case "right":
            context.scale(1, -1)
            context.rotate(Math.PI * 3 / 2)
            context.drawImage(snakeHead, -15, 15, 50, 50)
            break
          case "left":
            context.rotate(Math.PI / 2)
            context.drawImage(snakeHead, -15, -3, 50, 50)
            break
          case "down":
            context.rotate(0)
            context.drawImage(snakeHead, -15, 5, 50, 50)
            break
          case "up":
            context.rotate(Math.PI)
            context.drawImage(snakeHead, -35, -3, 50, 50)
            break
        }

        renderLaser(context, snake, snakeHead)
      }
      context.restore()
    }
  }

  const handleOutOfBounds = (canvas, snake, snakeHead, cell) => {
    if (gameModeRef.current == "singlePlayer") {
      if (snake.playerId == playerRef.current) {
        if (cell.x >= (canvas.width - 15) || cell.y >= (canvas.height)) {
          gameOver()
        } else if (cell.x < 0 || cell.y < 0) {
          gameOver()
        }
      }
    } else
      if (cell.x >= (canvas.width - 15)) {
        snakeHead.x = 0
      } else if (cell.y >= canvas.height - 15) {
        snakeHead.y = 0
      }
      else if (cell.x < 0) {
        snakeHead.x = canvas.width - 16
      } else if (cell.y < 0) {
        snakeHead.y = canvas.height - 16
      }
  }

  const canvasRef = useRef(null)

  const draw = (playerSnakeArray) => {
    const canvas = canvasRef.current
    if (!canvas || !playerSnakeArray)
      return;
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    renderGameBoard(context, canvas)

    if (acronymStatus) {
      renderFullWorld(context)
    }
    playerSnakeArrayRef.current.forEach(snake => {
      let updatedCells = updateBody(snake.snakeCells)
      let snakeHead = updatedCells.slice(-1)[0]

      if (snake.aiStatus) {
        AI.moveToFood(foodRef.current, snakeHead, socket, snake.playerId, gameMode, updateSnakeArray)
        if (gameModeRef.current == "singlePlayer")
          renderAiGuide(context, snakeHead, snake.direction)
      } else {
        let speed = snake.status != "frozen" ? speedRef.current : 0.5

        switch (snake.direction) {
          case "right":
            snakeHead.x += speed
            break
          case "left":
            snakeHead.x -= speed
            break
          case "down":
            snakeHead.y += speed
            break
          case "up":
            snakeHead.y -= speed
            break
          default:
            break
        }

        headBodyCollisionCheck(snakeHead, snake.snakeCells)
      }
      renderFood(context)
      renderPowerUp(context)
      foodCheck(snakeHead, updatedCells, snake.closeToFood, snake.playerId, snake.score)
      powerUpCheck(snakeHead, snake.playerId)
      renderBullet(context, snake, snakeHead)

      snake.snakeCells.forEach((cell, index) => {
        handleOutOfBounds(canvas, snake, snakeHead, cell)
        renderSnake(context, index, snake, cell)
      })
    })
  }

  return (
    <div>
      {!gameStart ? <GameMenu gameStart={gameStart} setAiSpeed={AI.setSpeed} setGameStart={setGameStart} socket={socket} setGameMode={setGameMode} setPlayerSnakeArray={setPlayerSnakeArray} gameModeRef={gameModeRef} playerSnakeArrayRef={playerSnakeArrayRef} /> :
        <div>
          <GameOverScreen isGameOver={isGameOver} playerSnakeArrayRef={playerSnakeArrayRef} playerId={playerId} score={score} setGameOver={setGameOver} />
          <TopBar score={score} socket={socket}
            setAcronymStatus={setAcronymStatus}
            acronymStatus={acronymStatus}
            setVolume={setVolume} volume={volume}
            fullWord={currentAcronym.fullWord}
            playerSnakeArray={playerSnakeArray}
            playerId={playerId}
            updateFieldChange={updateSnakeArray}
            gameMode={gameMode}
            pause={pause}
            setPause={setPause} />
          <CanvasWrapper food={foodRef.current} canvasRef={canvasRef} showConfetti={showConfetti} isNewLevel={isNewLevel} setIsNewLevel={setIsNewLevel} powerUpText={powerUpText} />
        </div>}
    </div>
  )
}

export default App
