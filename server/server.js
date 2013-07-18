Meteor.startup(function () {

    var user = function ( _id, name) {
        return findOrCreate(new User({_id: _id, profile: {name: name} }));
    }

    var theBoss = user('_the_boss', 'The Boss');
    var theObiettore = user('_the_obiettore', 'The Obiettore');

    if (Kudos.find().count() === 0) {

        var kudos = [
            {
                fromId: theBoss._id,
                toId: theObiettore._id,
                reason: "Mi piace un sacco sto roba"
            },
            {
                fromId: theObiettore._id,
                toId: theBoss._id,
                reason: "Ma quanto mi piace!"
            }
        ];

        for (var i = 0; i < kudos.length; i++) {
            new Kudo( kudos[i]).save();
        }

    }
});

Accounts.onCreateUser(function(options, user) {
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;

    return user;
});

function getDomain(email) {
    return email.replace(/.*@/, "");
}

function findOrCreate(test) {

    var user = Users.findOne({_id: test._id});

    if(!user) {
        user = Users.insert(test);
    }

    return user;
}

