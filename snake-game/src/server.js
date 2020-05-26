var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

function randomLocation() {
    let x = Math.floor(Math.random() * 100 / 2) * 2;
    let y = Math.floor(Math.random() * 100 / 2) * 2;
    return { 'x': x, 'y': y }
  }
  
let snakeCells =[
    { 'x': 0, 'y': 0 },
    { 'x': 2, 'y': 0 },
    { 'x': 4, 'y': 0 },
    { 'x': 6, 'y': 0 },
  ];

  let snakecells2 = [
        { 'x': 10, 'y': 10 },
        { 'x': 12, 'y': 10 },
        { 'x': 14, 'y': 10 },
        { 'x': 16, 'y': 10 },
      ]
  

let food = randomLocation()

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount} connected`)

    // socket.emit('playerCount', io.engine.clientsCount)

    socket.on('playerCount', function(data) {
        socket.emit("sendFood", io.engine.clientsCount)
     });


     socket.on('getFood', function(data) {
        socket.emit("sendFood", food)
     });

     socket.on('updateBody', function(data) {
        snakeCells = [...data.snakeCells]
        socket.broadcast.emit('updateBodyBroadcast', {"playerId": data.playerId,"snakeCells": snakeCells})
     });


     socket.on('updateFood', function(data) {
        food = data
        socket.broadcast.emit('updateFoodBroadcast', food)
     });

     socket.on('randomFood', function(data) {
        food = randomLocation()
        io.sockets.emit('updateFoodBroadcast', food)
     });
     
     socket.on('updateDirection', function(data) {
        socket.broadcast.emit('updateDirectionBroadcast', ({"playerId": data.playerId,'direction': data.direction}))
     });


    socket.on('disconnect', (socket) => {
        socket.broadcast.emit('updateDirectionBroadcast', ({"playerId": data.playerId,'direction': data.direction}))
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});