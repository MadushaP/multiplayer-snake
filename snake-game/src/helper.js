const isArrayInArray = (arr, item) => {
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

const randomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = {
    isArrayInArray: isArrayInArray,
    arrayEquals: arrayEquals,
    randomItem: randomItem
}
