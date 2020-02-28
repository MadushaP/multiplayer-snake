function aiGridAlignment(snakeHead) {
    // let snakeHead = snakeCells.slice(-1)[0]
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

function tick(snakeCells, food, updateBody, outOfBoundsCheck, setFood, hasEatenFood, randomLocation, setSpeed, speed, setScore, setSnake) {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = snakeCells.slice(-1)[0]
    let distanceX = food[0] - snakeHead[0]
    let distanceY = food[1] - snakeHead[1]
    let snakeTail = updatedCells[0]

    if (distanceX > 0 || distanceY > 0) {
        if (distanceX != 0) {
            snakeHead[0] += 2
        } else
            if (distanceY != 0) {
                snakeHead[1] += 2
            }
    }
    else if (distanceX < 0 || distanceY < 0) {
        if (distanceX != 0) {
            snakeHead[0] -= 2
        } else
            if (distanceY != 0) {
                snakeHead[1] -= 2
            }
    }

    aiGridAlignment(snakeHead)
    outOfBoundsCheck(snakeHead)

    //Turn this on when AI doesn't go through it self
    //headBodyCollisionCheck(snakeHead)

    if (hasEatenFood(snakeHead)) {
        setFood(randomLocation())
        setSpeed(speed - 10)
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