var express = require('express');
var app = express()
app.use(express.json())

var http = require('http').createServer(app)
var io = require('socket.io')(http)
const { randomLocation } = require('./lib/helper')
var AWS = require("aws-sdk");
const dotenv = require('dotenv');
dotenv.config();

if (process.env.ENVIRONMENT == 'dev') {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "eu-west-1"
  });
} else {
  AWS.config.update({
    region: "eu-west-1"
  });
}


const getNextColour = () => {
  if (snakeColours.length == 0) {
    snakeColours = ['C70039', 'FFC300', 'DAF7A6', 'DEDEDE', '5CFFE7']
  }
  return snakeColours.shift()
}

let snakeColours = ['C70039', 'FFC300', 'DAF7A6', 'DEDEDE', '5CFFE7']
let snakeCells = []
let food = randomLocation()
let currentPower
let powers = [
  { power: "freeze", location: randomLocation() },
  { power: "gun", location: randomLocation() },
]

let syncNewPlayerBackOff = false
let foodBackOff = false


setInterval(() => {
  currentPower = powers[Math.floor(Math.random() * powers.length)]
  currentPower.location = randomLocation()
  io.sockets.emit("powerUpChange", currentPower)
}, 10000)

io.on('connection', (socket) => {
  console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
  socket.playerNum = io.engine.clientsCount

  socket.on('getPlayerId', () => {
    socket.emit('getPlayerId', socket.id)
    socket.emit("getFood", food)
    socket.emit("powerUpChange", currentPower)
  })

  socket.on('syncAll', (data) => {
    io.sockets.emit("sendPlayerSnakeArray", data.snakeArray)
  })


  socket.on('syncNewPlayer', (data) =>  {
  if (!syncNewPlayerBackOff) {
    snakeArray = data.snakeArray
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
      colour: getNextColour(),
      aiStatus: false,
      score: 0,
      status: 'none'
    })
    io.sockets.emit("sendPlayerSnakeArray", snakeArray)
    syncNewPlayerBackOff = true
    setTimeout(() => { syncNewPlayerBackOff = false}, 200)
  }
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
        colour: getNextColour(),
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

  socket.on('randomFood', () => {
    if (!foodBackOff) {
      food = randomLocation()
      io.sockets.emit('updateFoodBroadcast', food)
      foodBackOff = true
      setTimeout(() => foodBackOff = false, 200)
    }
  })

  socket.on('scoreUpdate', (data) => {
    socket.broadcast.emit('scoreUpdate', data);
  })

  socket.on('increaseSnakeLength', (data) => {
    io.sockets.emit('increaseSnakeLength', data);
  })


  let powerBackOff = false

  socket.on('powerExecute', (data) => {
    if (!powerBackOff) {
      if (data.status == "freeze") {
        io.sockets.emit('freeze', data)
        io.sockets.emit("powerUpChange", null)
      } else if (data.status == "gun") {
        io.sockets.emit('loadGun', data)
        io.sockets.emit("powerUpChange", null)
      } else if (data.status == "fireBullet") {
        io.sockets.emit('fireBullet', data)
      }
      powerBackOff = true
      setTimeout(() => powerBackOff = false, 200)
    }
  })


  socket.on('restart', () => {
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
        colour: getNextColour(),
        aiStatus: false,
        score: 0,
        status: 'none'
      })
      socket.emit("sendPlayerSnakeArray", snakeCells)
    } else {
      socket.broadcast.emit("playerJoined", { 'newId': socket.id, 'playerCount': io.engine.clientsCount })
    }
  })

  socket.on('disconnect', () => {
    console.log("Player", socket.playerNum, "id:", socket.id, "disconnected")
    snakeCells = snakeCells.filter(x => x.playerId != socket.id)
    io.sockets.emit("clear", { playerId: socket.id })
  })

  socket.on('multiGameOver', () => {
    snakeCells = snakeCells.filter(x => x.playerId != socket.id)
    io.sockets.emit("clear", { playerId: socket.id })
  })


})


http.listen(3001, () => {
  console.log('listening on *:3001')
})

app.get('/getHighScore', (req, res) => {
  const ddb = new AWS.DynamoDB({ apiVersion: '2011-12-05' });

  var params = {
    TableName: "snake-highscore",
  };

  ddb.scan(params, function (err, data) {
    if (err) {
      console.log(err)
      res.send(err)
    }
    else {
      res.send(data)
    }
  })
})

app.post('/putHighScore', (req, res) => {
  //To ensure the currentPlayer flag it not placed in DB
  delete req.body['currentPlayer']

  var params = {
    TableName: 'snake-highscore',
    Item: req.body
  };

  var documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2011-12-05' });

  documentClient.put(params, function (err, data) {
    if (err)
      res.send(err)
    else
      res.send(data)
  });

})


process.on('uncaughtException', (exception) => {
  console.log(snakeCells)
  console.log(exception)
})

