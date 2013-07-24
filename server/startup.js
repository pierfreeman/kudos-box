Meteor.startup(function () {

    var user = function ( _id, name) {

        return findOrCreate(new User({_id: _id, profile:
        {
            name: name,
            email: _id.replace(/_/g, '') + "@byte-code.com",
            domain: 'byte-code.com',
            received: 0,
            sent: 0
        }
        }));
    }

    var theBoss = user('_the_boss', 'The Boss');
    var theObiettore = user('_the_obiettore', 'The Obiettore');

    if (Kudos.find().count() === 0) {

        var kudos = [
            {
                from: theBoss,
                to: theObiettore,
                reason: "Mi piace un sacco sto roba"
            },
            {
                from: theObiettore,
                to: theBoss,
                reason: "Ma quanto mi piace!"
            }
        ];

        kudos.forEach(function(kudo) {
            emitKudo(kudo.from, kudo.to, kudo.reason);
        });

    }
});



function findOrCreate(test) {

    var user = Users.findOne({_id: test._id});

    if(!user) {
        Users.insert(test);
        user = test;
    }

    return user;
}


