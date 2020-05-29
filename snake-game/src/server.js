var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

function randomLocation() {
    let x = Math.floor(Math.random() * 100 / 2) * 2;
    let y = Math.floor(Math.random() * 100 / 2) * 2;
    return { 'x': x, 'y': y }
}

let snakeCells = [];
let food = randomLocation()

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount}: ${socket.id}, connected`)
    socket.playerNum = io.engine.clientsCount

    socket.emit("getPlayerId", socket.id)
    socket.emit("getFood", food)
    socket.emit("sendPlayerSnakeArray", snakeCells)

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
        colour: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
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
        snakeCells = snakeCells.filter(x => x.playerId != socket.id)
        io.sockets.emit("sendPlayerSnakeArray", snakeCells)
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});