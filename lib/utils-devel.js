
// Those methods are intended for development reasons and should be removed when real data will be added.

getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1));
};

getRandomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
};

makeMessage = function (size) {

    var possible = " ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz";
    var text = "";

    for( var i=0; i < size; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};