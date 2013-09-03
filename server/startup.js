Meteor.startup(function () {

    var domain = function(name) {

        return findOrCreateDomain(new GroupDomain(
            {
                'admin': null,
                'name': name,
                'public': true,
                'rules': {
                    'period': 7,
                    'kudosForPeriod': 3,
                    'maxSpendableKudosAllowed': 100
                }
            }
        ));
    };

    var user = function(_id, name, domain) {

        return findOrCreateUser(new User(
            {
                _id: _id,
                profile: {
                    name: name,
                    email: _id.replace(/_/g, '') + "@byte-code.com",
                    domain: domain.name,
                    picture: "/generic_avatar.gif"
                },
                balance: {
                    received: 0,
                    sent: 0,
                    spendable: 100,
                    currency: 0
                }
            }
        ));
    };

    var u2 = user('_rogers', 'Steve Rogers', domain('byte-code'));
    var u4 = user('_nathy', 'Natasha Romanoff', domain('byte-code'));
    var u1 = user('_stark', 'Tony Stark', domain('byte-code'));
    var u3 = user('_banner', 'Bruce Banner', domain('byte-code'));
    var u5 = user('_barton', 'Clint Barton', domain('byte-code'));
    var u6 = user('_thor', 'Thor TheGreat', domain('byte-code'));

    if (Kudos.find().count() === 0) {

        var users = [u1, u2, u3, u4, u5, u6];
        for (var i = 0; i < 500; i++) {

            var fi = getRandom(0, 5);
            var fromUser = users[fi];
            var toUser = users[fi == 5 ? 0 : fi + 1];
            var when = getRandomDate(new Date(2012, 1, 1), new Date());
            var reason = makeMessage(getRandom(15, 100));

            emitKudo(fromUser, toUser, reason, when);
        }
    }
});

function findOrCreateUser(test) {

    var user = Users.findOne({_id: test._id});
    if(!user) {
        Users.insert(test);
        user = test;
    }
    return user;
}

function findOrCreateDomain(test) {

    var domain = Domains.findOne({name: test.name});
    if (!domain) {
        Domains.insert(test);
        domain = test;
    }
    return domain;
}


