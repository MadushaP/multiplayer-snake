const aiGridAlignment = (snakeHead) => {
    if (snakeHead.x > 400) {
        snakeHead.x -= 2
        snakeHead.y += 2
    } else if (snakeHead.x < 0) {
        snakeHead.x += 2
        snakeHead.y += 2
    }
    else if (snakeHead.y > 400) {
        snakeHead.x -= 2
        snakeHead.y -= 2
    }
    else if (snakeHead.y < 0) {
        snakeHead.x += 2
        snakeHead.y += 2
    }
}

const moveToFood = (food, snakeHead, socket, playerId, gameMode, updateFieldChanged) => {
    let distanceX = food.x - snakeHead.x
    let distanceY = food.y - snakeHead.y
    if (distanceX > 0){
    
        if(distanceY > 0){
          snakeHead.y += 2
          updateFieldChanged(playerId, 'direction', 'down')
        } else {
            snakeHead.x += 2
            updateFieldChanged(playerId, 'direction', 'right')
        }
         
    } else if(distanceX < 0){

        if(distanceY < 0){
            snakeHead.y -= 2
            updateFieldChanged(playerId, 'direction', 'up')
          } else {
              snakeHead.x -= 2
              updateFieldChanged(playerId, 'direction', 'left')
          }
    } 
     else if (distanceY > 0){
        snakeHead.y += 2
         updateFieldChanged(playerId, 'direction', 'down')
    } else if(distanceY < 0){
        snakeHead.y -= 2
        updateFieldChanged(playerId, 'direction', 'up')
    }
   
}

const headBodyAlignment = (snakeHead, updatedCells, direction) => {
    for (let i = 0; i < updatedCells.length - 1; i++) {
        if (snakeHead.x === updatedCells[i].x && snakeHead.y === updatedCells[i].y) {
            if (direction === "left") {
                snakeHead.x -= 2
                snakeHead.y -= 2
            } else if (direction === "right") {
                snakeHead.x += 2
                snakeHead.y += 2
            } else if (direction === "up") {
                snakeHead.x -= 2
                snakeHead.y += 2
            } else if (direction === "down") {
                snakeHead.x += 2
                snakeHead.y -= 2
            }
            return
        }
    }
}

const tick = (snakeCells, direction, closeToFood, foodCheck, playerId, setSpeed, updateBody, food, socket, gameMode, updateFieldChange, draw) => {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = snakeCells.slice(-1)[0]

    moveToFood(food, snakeHead, socket, playerId, gameMode, updateFieldChange)
    // headBodyAlignment(snakeHead, updatedCells, direction)
    // aiGridAlignment(snakeHead)


    //Turn this on when AI is improved
    //headBodyCollisionCheck(snakeHead)    
    // outOfBoundsCheck(snakeHead)

    foodCheck(snakeHead, updatedCells, closeToFood, playerId, socket)
    updateFieldChange(playerId, 'snakeCells', updatedCells)

    draw(updatedCells, closeToFood)
}


module.exports = {
    tick
}