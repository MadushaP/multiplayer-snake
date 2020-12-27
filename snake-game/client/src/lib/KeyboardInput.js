const singlePlayerKeyPress = (playerSnakeArrayRef, playerRef, updateFieldChanged, key) => {
    if (playerSnakeArrayRef.current.length === 0)
        return
    let currentDirection = playerSnakeArrayRef.current.find(x => x.playerId === playerRef.current).direction
    switch (key) {
        case "ArrowRight":
            if (currentDirection !== "left") {
                updateFieldChanged(playerRef.current, 'direction', "right")
            }
            break
        case "ArrowLeft":
            if (currentDirection !== "right") {
                updateFieldChanged(playerRef.current, 'direction', "left")
            }
            break
        case "ArrowDown":
            if (currentDirection !== "up") {
                updateFieldChanged(playerRef.current, 'direction', "down")
            }
            break
        case "ArrowUp":
            if (currentDirection !== "down") {
                updateFieldChanged(playerRef.current, 'direction', "up")
            }
            break
        default:
            break
    }
}

const multiplayerKeyPress = (playerSnakeArrayRef, playerRef, socket, updateFieldChanged, key) => {
    if (playerSnakeArrayRef.current.length === 0)
        return
    let currentDirection = playerSnakeArrayRef.current.find(x => x.playerId === playerRef.current).direction
    let currentPower = playerSnakeArrayRef.current.find(x => x.playerId === playerRef.current).status
    switch (key) {
        case "ArrowRight":
            if (currentDirection !== "left") {
                updateFieldChanged(playerRef.current, 'direction', "right")
                socket.emit('playerKeyEvent', { 'playerId': playerRef.current, "direction": "right" })
            }
            break
        case "ArrowLeft":
            if (currentDirection !== "right") {
                updateFieldChanged(playerRef.current, 'direction', "left")
                socket.emit('playerKeyEvent', { 'playerId': playerRef.current, "direction": "left" })
            }
            break
        case "ArrowDown":
            if (currentDirection !== "up") {
                updateFieldChanged(playerRef.current, 'direction', "down")
                socket.emit('playerKeyEvent', { 'playerId': playerRef.current, "direction": "down" })
            }
            break
        case "ArrowUp":
            if (currentDirection !== "down") {
                updateFieldChanged(playerRef.current, 'direction', "up")
                socket.emit('playerKeyEvent', { 'playerId': playerRef.current, "direction": "up" })
            }
            break
        case " ":
            if(currentPower === "gun") {
                socket.emit('powerExecute', { 'playerId': playerRef.current, "status": "fireBullet" })
            }
            break

        default:
            break
    }
}

module.exports = {
    singlePlayerKeyPress,
    multiplayerKeyPress
}