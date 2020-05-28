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
    console.log(`Player ${io.engine.clientsCount} connected`)

    socket.id = io.engine.clientsCount - 1
    console.log(socket.id)

    // io.sockets.emit("getPlayerId", socket.id)
    io.sockets.emit("getFood", food)

    snakeCells.push({
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

    
    socket.on('getPlayerId', function (data) {
        socket.emit("getPlayerId", socket.id)
    });

    socket.on('getPlayerSnakeArray', function (data) {
        socket.emit("sendPlayerSnakeArray", snakeCells)
    });

    socket.on('setPlayerSnakeArray', function (data) {
        let newArr = [...snakeCells];

        newArr[data.playerId][data.prop] = data.value;
        console.log(newArr)

        io.sockets.emit("sendPlayerSnakeArray", newArr)
    });


    socket.on('updateFood', function (data) {
        food = data
        socket.broadcast.emit('updateFoodBroadcast', food)
    });

    socket.on('randomFood', function (data) {
        food = randomLocation()
        io.sockets.emit('updateFoodBroadcast', food)
    });

    socket.on('updateDirection', function (data) {
        socket.emit('updateDirectionBroadcast', ({ "playerId": data.playerId, 'direction': data.direction }))
    });


    socket.on('disconnect', () => {
        console.log("player", socket.id + 1, "disconnected")
        snakeCells.splice(socket.id, 1)
        socket.id=-1
        io.sockets.emit("sendPlayerSnakeArray", snakeCells)
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});