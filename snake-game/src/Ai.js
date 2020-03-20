function aiGridAlignment(snakeHead) {
    if (snakeHead.x > 99) {
        snakeHead.x -= 2
        snakeHead.y += 2
    } else if (snakeHead.x < 0) {
        snakeHead.x += 2
        snakeHead.y += 2
    }
    else if (snakeHead.y > 99) {
        snakeHead.x -= 2
        snakeHead.y -= 2
    }
    else if (snakeHead.y < 0) {
        snakeHead.x += 2
        snakeHead.y += 2
    }
}

function moveToFood(distanceX, distanceY, snakeHead, setDirection, updatedCells, direction) {
    console.log(direction)
    if (distanceX > 0 || distanceY > 0) {
        if (distanceX != 0) {
            snakeHead.x += 2
            setDirection("right")
        } else if (distanceY != 0) {
            snakeHead.y += 2
            setDirection("down")
        }
    }
    else if (distanceX < 0 || distanceY < 0) {
        if (distanceX != 0) {
            snakeHead.x -= 2
            setDirection("left")
        } else if (distanceY != 0) {
            snakeHead.y -= 2
            setDirection("down")
        }
    }
}

function headBodyAlignment(snakeHead, updatedCells, direction) {
    for (let i = 0; i < updatedCells.length - 1; i++) {
        if (snakeHead.x == updatedCells[i].x && snakeHead.y == updatedCells[i].y) {
            console.log("collide", direction)
            if (direction == "left") {
                snakeHead.x -= 2
                snakeHead.y -= 2
            } else if (direction == "right") {
                snakeHead.x += 2
                snakeHead.y += 2
            } else if (direction == "up") {
                snakeHead.x -= 2
                snakeHead.y += 2
            } else if (direction == "down") {
                snakeHead.x += 2
                snakeHead.y -= 2
            }
            return;
        }
    }
}

function tick(snakeCells, food, updateBody, outOfBoundsCheck, 
              setFood, hasEatenFood, randomLocation, setSpeed, 
              speed, setScore, setSnake, setDirection, direction, volume) {
    setSpeed(25)

    let updatedCells = updateBody(snakeCells)
    let snakeHead = snakeCells.slice(-1)[0]
    let distanceX = food.x - snakeHead.x
    let distanceY = food.y - snakeHead.y
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
        var bloop = new Audio('bloop.mp3');
        bloop.volume = volume
        bloop.play();
        updatedCells.unshift({'x':snakeTail.x, 'y':snakeTail.y})
        setSnake(updatedCells)
    } else {
        setSnake(updatedCells)
    }
}


module.exports = {
    tick
}