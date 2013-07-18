
pluck = function (array, property) {
    var i, rv = [];

    for (i = 0; i < array.length; ++i) {
        rv[i] = array[i][property];
    }

    return rv;
}