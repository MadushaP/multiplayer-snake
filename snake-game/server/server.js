var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const { randomLocation } = require('./lib/helper')

let snakeColours = ['C70039', 'FFC300', 'DAF7A6', 'DEDEDE', '5CFFE7']
let snakeCells = []
let food = randomLocation()
let currentPower
let powers = [
  { power: "freeze", location: randomLocation() },
  { power: "gun", location: randomLocation() },
]
// let powers = [
//   { power: "gun", location: randomLocation() },
// ]
// let powers = [
//   { power: "freeze", location: randomLocation() },
// ]

setInterval(() => {
  currentPower = powers[Math.floor(Math.random() * powers.length)]
  currentPower.location = randomLocation()
  io.sockets.emit("powerUpChange", currentPower)
}, 10000)

io.on('connection', (socket) => {
  console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
  socket.playerNum = io.engine.clientsCount

  const randomColour = snakeColours[Math.floor(Math.random() * snakeColours.length)]
  snakeColours = snakeColours.filter(colour => colour != randomColour)

  socket.on('getPlayerId', () => {
    socket.emit('getPlayerId', socket.id)
    socket.emit("getFood", food)
    socket.emit("powerUpChange", currentPower)
  })

  socket.on('syncAll', (data) => {
    io.sockets.emit("sendPlayerSnakeArray", data.snakeArray)
  })

  socket.on('syncNewPlayer', (data) => {
    snakeArray = data.snakeArray
    const randomColour = snakeColours[Math.floor(Math.random() * snakeColours.length)]
    snakeArray.push({
      playerId: data.newId,
      snakeCells: [
        { 'x': 10, 'y': 10 },
        { 'x': 12, 'y': 10 },
        { 'x': 14, 'y': 10 },
        { 'x': 16, 'y': 10 },
      ],
      direction: "right",
      closeToFood: false,
      colour: randomColour,
      aiStatus: false,
      score: 0,
      status: 'none'
    })
    io.sockets.emit("sendPlayerSnakeArray", snakeArray)
  })

  socket.on('startMultiplayer', () => {
    console.log("start multiplayer")
    if (io.engine.clientsCount == 1) {
      snakeCells.push({
        playerId: socket.id,
        snakeCells: [
          { 'x': 10, 'y': 10 },
          { 'x': 12, 'y': 10 },
          { 'x': 14, 'y': 10 },
          { 'x': 16, 'y': 10 },
        ],
        direction: "right",
        closeToFood: false,
        colour: randomColour,
        aiStatus: false,
        score: 0,
        status: 'none'
      })
      socket.emit("sendPlayerSnakeArray", snakeCells)
    } else {
      socket.broadcast.emit("playerJoined", { 'newId': socket.id, 'playerCount': io.engine.clientsCount })
    }
  })

  socket.on('playerKeyEvent', (data) => {
    socket.broadcast.emit('playerKeyEvent', data);
  })

  let foodBackOff = false
  socket.on('randomFood', () => {
    if (!foodBackOff) {
      food = randomLocation()
      io.sockets.emit('updateFoodBroadcast', food)
      foodBackOff = true
      setTimeout(() => foodBackOff = false, 200)
    } else {
      console.log("back off")
    }
  })

  socket.on('scoreUpdate', (data) => {
    socket.broadcast.emit('scoreUpdate', data);
  })

  socket.on('increaseSnakeLength', (data) => {
    io.sockets.emit('increaseSnakeLength', data);
  })

  socket.on('powerExecute', (data) => {
    if (data.status == "freeze") {
      io.sockets.emit('freeze', data)
      io.sockets.emit("powerUpChange", null)
    } else if (data.status == "gun") {
      io.sockets.emit('loadGun', data)
      io.sockets.emit("powerUpChange", null)
    } else if (data.status == "fireBullet") {
      io.sockets.emit('fireBullet', data)
    }
  })

  socket.on('disconnect', () => {
    console.log("Player", socket.playerNum, "id:", socket.id, "disconnected")
    snakeColours.push(randomColour)
    snakeCells = snakeCells.filter(x => x.playerId != socket.id)
    io.sockets.emit("clear", { playerId: socket.id })
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('uncaughtException', (exception) => {
  console.log(snakeCells)
  console.log(exception)
})