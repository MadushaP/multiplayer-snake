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
let direction = "right"
let direction2 = "right"

io.on('connection', (socket) => {
    console.log(`Player ${io.engine.clientsCount} connected`)
    io.sockets.emit('playerCount', io.engine.clientsCount)

     socket.on('getFood', function(data) {
        socket.emit("sendFood", food)
     });

     socket.on('updateBody', function(updatedBody) {
        snakeCells = [...updatedBody]
        socket.broadcast.emit('updateBodyBroadcast', snakeCells)
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
        direction = data
        socket.broadcast.emit('updateDirectionBroadcast', direction)
     });

//Player 2
     socket.on('updateBody2', function(updatedBody) {
        snakecells2 = [...updatedBody]
        socket.broadcast.emit('updateBodyBroadcast2', snakecells2)
     });

     socket.on('updateDirection2', function(data) {
        direction2 = data
        socket.broadcast.emit('updateDirectionBroadcast2', direction2)
     });

    // socket.on('disconnect', (socket) => {
    //     console.log('a player disconnected');
    // });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});