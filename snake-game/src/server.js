var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

function randomLocation() {
    let x = Math.floor(Math.random() * 100 / 2) * 2;
    let y = Math.floor(Math.random() * 100 / 2) * 2;
    return { 'x': x, 'y': y }
}

let snakeColours = ['C70039','FFC300','DAF7A6','DEDEDE','5CFFE7']
let snakeCells = [];
let food = randomLocation()

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
    socket.playerNum = io.engine.clientsCount

    socket.emit("getPlayerId", socket.id)
    socket.emit("getFood", food)

    const randomColour = snakeColours[Math.floor(Math.random() * snakeColours.length)];
    snakeColours = snakeColours.filter(colour => colour != randomColour )
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
        colour: randomColour
        })
    io.sockets.emit("sendPlayerSnakeArray", snakeCells)

    socket.on('setPlayerSnakeArray', function (data) {
        snakeCells.find(x => x.playerId == data.playerId)[data.prop] = data.value
        io.sockets.emit("sendPlayerSnakeArray", snakeCells)
    });

    socket.on('randomFood', function (data) {
        food = randomLocation()
        io.sockets.emit('updateFoodBroadcast', food)
    });

    socket.on('updateDirection', function (data) {
        snakeCells.find(x => x.playerId == data.playerId).direction = data.direction
        socket.emit('sendPlayerSnakeArray', snakeCells)
    });

    socket.on('disconnect', () => {
        console.log("Player", socket.playerNum, "id:", socket.id, "disconnected")
        snakeColours.push(randomColour)
        snakeCells = snakeCells.filter(x => x.playerId != socket.id)
        io.sockets.emit("sendPlayerSnakeArray", snakeCells)
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});