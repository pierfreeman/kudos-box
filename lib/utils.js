
pluck = function (array, property) {
    var i, rv = [];

    for (i = 0; i < array.length; ++i) {
        rv[i] = array[i][property];
    }

    return rv;
};

isEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

getDomain = function (email) {
    return email.replace(/.*@/, "");
};

safeName = function(user) {
    if (user) {
        return user.screenName();
    } else {
        return 'MISSING';
    }
};

makeKudoId = function() {

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var text = "";

    for( var i=0; i < 17; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

makeAlertId = function(){
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var text = "";

    for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

