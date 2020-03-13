function aiGridAlignment(snakeHead) {
    if (snakeHead[0] > 99) {
        snakeHead[0] -= 2
        snakeHead[1] += 2
    } else if (snakeHead[0] < 0) {
        snakeHead[0] += 2
        snakeHead[1] += 2
    }
    else if (snakeHead[1] > 99) {
        snakeHead[0] -= 2
        snakeHead[1] -= 2
    }
    else if (snakeHead[1] < 0) {
        snakeHead[0] += 2
        snakeHead[1] += 2
    }
}

function moveToFood(distanceX, distanceY, snakeHead, setDirection, updatedCells, direction) {
    console.log(direction)
    if (distanceX > 0 || distanceY > 0) {
        if (distanceX != 0) {
            snakeHead[0] += 2
            setDirection("right")
        } else if (distanceY != 0) {
            snakeHead[1] += 2
            setDirection("down")
        }
    }
    else if (distanceX < 0 || distanceY < 0) {
        if (distanceX != 0) {
            snakeHead[0] -= 2
            setDirection("left")
        } else if (distanceY != 0) {
            snakeHead[1] -= 2
            setDirection("down")
        }
    }
}

function headBodyAlignment(snakeHead, updatedCells, direction) {
    for (let i = 0; i < updatedCells.length - 1; i++) {
        if (snakeHead[0] == updatedCells[i][0] && snakeHead[1] == updatedCells[i][1]) {
            console.log("collide", direction)
            if (direction == "left") {
                snakeHead[0] -= 2
                snakeHead[1] -= 2
            } else if (direction == "right") {
                snakeHead[0] += 2
                snakeHead[1] += 2
            } else if (direction == "up") {
                snakeHead[0] -= 2
                snakeHead[1] += 2
            } else if (direction == "down") {
                snakeHead[0] += 2
                snakeHead[1] -= 2
            }
            return;
        }
    }
}

function tick(snakeCells, food, updateBody, outOfBoundsCheck, setFood, hasEatenFood, randomLocation, setSpeed, speed, setScore, setSnake, setDirection, direction) {
    setSpeed(25)

    let updatedCells = updateBody(snakeCells)
    let snakeHead = snakeCells.slice(-1)[0]
    let distanceX = food[0] - snakeHead[0]
    let distanceY = food[1] - snakeHead[1]
    let snakeTail = updatedCells[0]

    moveToFood(distanceX, distanceY, snakeHead, setDirection, updatedCells, direction)
    aiGridAlignment(snakeHead)
    headBodyAlignment(snakeHead, updatedCells, direction)

    //Turn this on when AI doesn't go through it self
    //headBodyCollisionCheck(snakeHead)    
    outOfBoundsCheck(snakeHead)

    if (hasEatenFood(snakeHead)) {
        setFood(randomLocation())
        setScore(score => score + 1)
        updatedCells.unshift([snakeTail[0], snakeTail[1]])
        setSnake(updatedCells)
    } else {
        setSnake(updatedCells)
    }
}


module.exports = {
    tick
}