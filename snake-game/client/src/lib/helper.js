const isObjectInArray = (arr, item) => {
    var item_as_string = JSON.stringify(item)
    var contains = arr.some((ele) => {
        return JSON.stringify(ele) === item_as_string
    })
    return contains
}

const arrayEquals = (array1, array2) => {
    if (JSON.stringify(array1) === JSON.stringify(array2)) {
        return true
    }
    else return false
}

const headAtFood = (snakeHead, food) => {
    let distanceX = Math.abs(snakeHead.x - food.x)
    let distanceY = Math.abs(snakeHead.y - food.y)
    if (distanceX <= 10 && distanceY <= 10) {
        return true
    }
    else return false
}

const randomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}     

const randomLocation = () => {
    let x = Math.floor(Math.random() * 1000)
    let y = Math.floor(Math.random() * (window.innerHeight - (window.innerHeight * 0.1)))
    return { 'x': x, 'y': y }
  }

module.exports = {
    isObjectInArray: isObjectInArray,
    arrayEquals: arrayEquals,
    randomItem: randomItem,
    headAtFood: headAtFood,
    randomLocation: randomLocation
}