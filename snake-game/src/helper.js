function isArrayInArray(arr, item) {
    var item_as_string = JSON.stringify(item);

    var contains = arr.some(function (ele) {
        return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}

function arrayEquals(array1, array2) {
    if (JSON.stringify(array1) === JSON.stringify(array2)) {
        return true
    }
    else return false
}

module.exports = {
    isArrayInArray:isArrayInArray,
    arrayEquals:arrayEquals
}
