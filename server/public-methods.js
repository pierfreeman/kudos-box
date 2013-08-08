
Meteor.methods({

    triggerUserStatus: function (user_id, status) {
        return Users.update({_id: user_id}, { $set : {'enabled': status }});
    },

    resetCounters: function (user_id) {
        return Users.update({_id: user_id}, { $set : { 'balance.sent': 0, 'balance.received': 0}});
    },

    emitKudoError: function(message) {
        Meteor.render("kudo_error");
    },

    emitKudo: function (targetUser, reason) {
        return emitKudo(Meteor.user(), targetUser, reason, new Date());
    },

    emitComment: function(kudo, message) {
        return emitComment(kudo, Meteor.user(), message);
    },

    initializeUserBalance: function() {

        // check user rights
        if (!Meteor.user().profile.admin) {
            throw new Meteor.Error(401, "You are not allowed to perform this operation")
        }

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

    unlikeKudo: function(kudoId) {
        unlikeKudo(Meteor.user()._id, kudoId);
    },

    newUserByEmail: function(email) {

        var user = new User({
            profile: {
                name: email,
                email: email,
                domain: getDomain(email),
                sent: 0,
                received: 0
            },
            balance: {
                received: 0,
                sent: 0,
                spendable: 100, //TODO change this number with 0 and implement a job that $inc them by policy
                currency: 0
            },
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
    },

    // Moar temporary method
    removeAllKudos: function() {
        Kudos.remove({ _id: /^.*/ });
    },

    /*
        Return a kudo and all connected information, knowing the "public id"
     */
    peekKudo: function(kudoId) {
        check(kudoId, String);
        var kudo = Kudos.findOne(kudoId);
        kudo.from = Kudos.find
        return kudo;
    }
});