
Meteor.methods({

    subscribeDomain: function(domain) {
        console.log("User: " + Meteor.user()._id + " Domain: " + domain);
        return subscribeDomain(domain, Meteor.user());
    },
            
    createDomain: function(domain) {
        return createDomain(domain, initKudo);
    },

    removeFromDomain: function(user_id) {
        var user = Users.findOne({_id: user_id});
        console.log(user);
        if (user.profile.admin) {
            Domains.update({name: user.profile.domain}, {$set: {admin: null}});
            console.log(Domains.findOne({name: user.profile.domain}));
        }
        return Users.update({_id: user_id}, { $set : {'profile.domain': null, 'profile.admin': false }});
    },

    giveAdminRights: function(user_id)  {
        Users.update({_id: user_id}, {$set: {'profile.admin': true}});
        Users.update({_id: Meteor.user()._id}, {$set: {'profile.admin': false}});
        var user = Users.findOne({_id: user_id, 'profile.admin': true});
        Domains.update({name: user.profile.domain}, {$set: {'admin': user_id}});
        return user;
    },

    decrementSpendable: function(user) {
        return Users.update({_id: user._id}, {$inc: {'balance.spendable': -1}});
    },

    incrementSpendable: function(user) {
        return Users.update({_id: user._id}, {$inc: {'balance.spendable': 1}});
    },

    resetCounters: function(user_id) {
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

    //TODO REMOVE! Now useless!
    // Temporary method
    removeLastKudo: function() {
        var one = Kudos.findOne({}, {sort: {when: -1}});
        Kudos.remove(one._id);
    },

    //TODO REMOVE! Now useless!
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
    }, 
    
    setPeriod: function(domain, period){
        return setPeriod(domain, period);
    },
            
    setKudosForPeriod: function(domain, kudos) {
        return setKudosForPeriod(domain, kudos);
    },
            
    setMaxKudos: function(domain, max) {
        return setMaxKudos(domain, max);
    }
});
