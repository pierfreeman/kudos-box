
Meteor.methods({

    emitKudo: function (targetUser, reason) {
        return emitKudo(Meteor.user(), targetUser, reason);
    },

    initializeUserBalance: function() {

        var users = Users.find({});
        users.forEach(function(user) {
            var profile = user.profile;

            setupUserProfileByService(profile, user);

            // here we can access all the kudos
            profile.sent = Kudos.find({
                domain: user.domain,
                fromId: user._id
                }).count();

            profile.received = Kudos.find({
                domain: user.domain,
                toId: user._id
            }).count();

            console.log('Welcome, Mr. {name}. S = {sent}, R = {received}'.assign( profile ));
            Users.update({'_id': user._id}, user);
        });
    },

    likeKudo: function(kudoId) {
        likeKudo(Meteor.user()._id, kudoId);
    },

    newUserByEmail: function(email) {

        var username = email.split('@')[0];

        var profile = {
            name: username,
            email: email,
            domain: getDomain(email),
            sent: 0,
            received: 0
        };

        var user = new User({
            profile:profile,
            info: {referralUserId: Meteor.userId},
            createdAt: new Date().time
        });

        Users.insert(user);
//        Accounts.createUser({
//            email: email,
//            profile: profile
//        });
        // we should send him an email to join us.
        // Accounts.sendEnrollmentEmail

        return user;
    },

    // Temporary method
    removeLastKudo: function() {
        var one = Kudos.findOne({}, {sort: {when: -1}});
        Kudos.remove(one._id);
    }
});