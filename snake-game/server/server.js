var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const { randomLocation } = require('./lib/helper')

let snakeColours = ['C70039', 'FFC300', 'DAF7A6', 'DEDEDE', '5CFFE7']
let snakeCells = []
let food = randomLocation()
let powerUp = randomLocation()


setInterval(() => {
    powerUp = randomLocation()
    io.sockets.emit("powerUpChange", powerUp)
}, 15000)

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
    socket.playerNum = io.engine.clientsCount

    const randomColour = snakeColours[Math.floor(Math.random() * snakeColours.length)]
    snakeColours = snakeColours.filter(colour => colour != randomColour)

    socket.on('getPlayerId', () => {
        socket.emit('getPlayerId', socket.id)
        socket.emit("getFood", food)
        socket.emit("powerUpChange", powerUp)
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
        socket.broadcast.emit('increaseSnakeLength', data);
    })

    socket.on('powerExecute', (data) => {
        socket.broadcast.emit('freeze',data)
        // powerUp =  {x:0, x:0}
        socket.emit("powerUpChange", {x:0, x:0})
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