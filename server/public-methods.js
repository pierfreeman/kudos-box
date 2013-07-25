
Meteor.methods({

    emitKudo: function (targetUser, reason) {
        return emitKudo(Meteor.user(), targetUser, reason);
    },

    initializeUserBalance: function() {

        var users = Users.find({});
        users.forEach(function(user) {
            var profile = user.profile;

            setupUserProfileByService(profile, user);

            var actual = {};
            // here we can access all the kudos
            actual.newSent = Kudos.find({
                domain: profile.domain,
                fromId: user._id
                }).count();

            actual.newReceived = Kudos.find({
                domain: profile.domain,
                toId: user._id
            }).count();

            console.log('UPDATE BALANCE {name} @ {domain}. S = {newSent} ({sent}), R = {newReceived} ({received})'.assign( profile, actual ));

            profile.sent = actual.newSent;
            profile.received = actual.newReceived;

            Users.update({'_id': user._id}, user);
        });
    },

    likeKudo: function(kudoId) {
        likeKudo(Meteor.user()._id, kudoId);
    },

    newUserByEmail: function(email) {

        //var username = email.split('@')[0];
        var username = email;

        var profile = {
            name: username,
            email: email,
            domain: getDomain(email),
            sent: 0,
            received: 0
        };

        var user = new User({
            profile: profile,
            createdAt: new Date().getTime()
        });
        user.info = {};
        user.info.referralUserId = Meteor.userId();

        var userId = Users.insert(user);

        this.unblock();

        sendInvitationEmail(userId);

        return user;
    },

    // Temporary method
    removeLastKudo: function() {
        var one = Kudos.findOne({}, {sort: {when: -1}});
        Kudos.remove(one._id);
    }
});