const helper = require('../src/lib/helper');

describe('helper', () => {
  test('isObjectInArray returns if object is an array', () => {
    let array = [{ a: "value1" }, { b: "value2" }, { b: "value3" }]
    expect(helper.isObjectInArray(array, { b: "value2" })).toBe(true)
    expect(helper.isObjectInArray(array, { b: "value404" })).toBe(false)

  })

  test('arrayEquals returns if two arrays are the same', () => {
    let array1 = [{ a: "value1" }, { b: "value2" }, { b: "value3" }]
    let array2 = [{ a: "value1" }, { b: "value2" }, { b: "value3" }]

    expect(helper.arrayEquals(array1, array2)).toBe(true)
    array2 = [{ a: "anotherValue" }, { b: "anotherValue" }, { b: "anotherValue" }]
    expect(helper.arrayEquals(array1, array2)).toBe(false)
  })

  test('headAtFood detects collision with snake head and food', () => {
    let snakeHead = { 'x': 10, 'y': 10 }
    let food =  { 'x': 5, 'y': 5 }

    expect(helper.headAtFood(snakeHead, food)).toBe(true)
    food =  { 'x': 50, 'y': 50 }
    expect(helper.headAtFood(snakeHead, food)).toBe(false)
  })

  test('randomItem selects a random item from an array', () => { 
    expect(helper.randomLocation().hasOwnProperty('x')).toBe(true)
    expect(helper.randomLocation().hasOwnProperty('y')).toBe(true)
  })

  test('randomLocation gives a random point on the canvas', () => {
    let firstRandom = helper.randomLocation()
    let secondRandom = helper.randomLocation()
    expect(firstRandom.x).not.toBe(secondRandom.x)
    expect(firstRandom.y).not.toBe(secondRandom.y)  
  })
})