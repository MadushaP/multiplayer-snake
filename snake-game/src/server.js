var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

const randomLocation = () => {
    let x = Math.floor(Math.random() * 350)
    let y = Math.floor(Math.random() * 350)
    return { 'x': x, 'y': y }
}

let snakeColours = ['C70039', 'FFC300', 'DAF7A6', 'DEDEDE', '5CFFE7']
let snakeCells = []
let food = randomLocation()

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
    socket.playerNum = io.engine.clientsCount

    const randomColour = snakeColours[Math.floor(Math.random() * snakeColours.length)]
    snakeColours = snakeColours.filter(colour => colour != randomColour)

    socket.on('getPlayerId', () => {
        socket.emit('getPlayerId', socket.id)
        socket.emit("getFood", food)
    })


    socket.on('playerOneSync', (data) => {
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
            })
            socket.emit("sendPlayerSnakeArray", snakeCells)
        } else {
            console.log(socket.id, "is broadcasting")
            socket.broadcast.emit("playerJoined", { 'newId': socket.id })
        }
    })

    socket.on('playerKeyEvent', (data) => {
        socket.broadcast.emit('playerKeyEvent', data);
    })

    socket.on('randomFood', () => {
        food = randomLocation()
        io.sockets.emit('updateFoodBroadcast', food)
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