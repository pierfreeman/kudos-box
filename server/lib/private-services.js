
// Private Methods
subscribeDomain = function(domainName, user) {

    //check if domain already exists or not
    var domain = Domains.findOne({name: domainName});
    if (!domain) {

        domain = createDomain(domainName, user, 5);
        Users.update({_id: user._id}, {$set: {'profile.admin': true}});
    } else {

        if (domain.admin === null) {
            Domains.update({_id: domain._id}, {$set: {admin: user._id}});
            Users.update({_id: user._id}, {$set: {'profile.admin': true}});
        } else {
            Users.update({_id: user._id}, {$set: {'profile.admin': false}});
        }
    }

    return Users.update({'_id': user._id}, {$set: {'profile.domain': domainName, 'balance.spendable': domain.rules.maxSpendableKudosAllowed}});
};

createDomain = function(domainName, user, initKudo) {

    var domain = new GroupDomain({
        'admin': user ? user._id : null,
        'name': domainName,
        'public': true,
        'rules': {
            "period" : 7,
            "kudosForPeriod" : 1,
            "maxSpendableKudosAllowed" : initKudo
        }
    });
    Domains.insert(domain);
    return domain;
};

emitKudo = function(fromUser, toUser, reason, when) {

    var kudo = new Kudo({
        _id: makeKudoId(),
        toId: toUser._id,
        fromId: fromUser._id,
        domain: fromUser.profile.domain,
        reason: reason,
        when: when
    });

    console.log('KUDO with ' + kudo._id + ' in ' + kudo.domain + ' from ' + fromUser.profile.name + ' to ' + toUser.profile.name + ' because ' + kudo.reason);

    Users.update(fromUser._id, {$inc: {'balance.sent': 1, 'balance.spendable': -1}});
    Users.update(toUser._id, {$inc: {'balance.received': 1, 'balance.currency': 1}});

    Kudos.insert(kudo);

    sendNotificationEmail(fromUser, toUser, kudo);

    return kudo;
};

emitComment = function(kudo, author, message) {

    var comment = {
        author : author._id,
        message : message,
        when : new Date()
    };

    console.log('Kudo ' + kudo._id + ' commented by ' + author._id);

    Kudos.update(kudo._id, {$push: {'comments' : comment}, $inc: {'commentsCount': 1}});
};

setupUserProfileByService = function (profile, user) {

    if (user.services) {
        if (user.services.google) {
            var google = user.services.google;
            profile.email = google.email;
            profile.picture =  google.picture;
            //profile.domain = getDomain(profile.email);
        }
    }
};

likeKudo = function (userId, kudoId) {

    Kudos.update({_id:kudoId}, { $addToSet: { likes: userId } });
};

unlikeKudo = function (userId, kudoId) {

    Kudos.update({_id:kudoId}, { $pull: { likes: userId } });
};

sendInvitationEmail = function(userId) {

    var invited = Users.findOne(userId);
    var referral = Users.findOne(invited.info.referralUserId);

    var options = {
        to: invited.profile.email,
        from: 'kudos@byte-code.com',
        subject: "Ehi, " + referral.profile + " wants you in Kudo Box!",
        text: "Visit http://kudo-box.meteor.com and join us!"
    };

    Email.send(options);
};

reconnectAccounts = function(email) {

    var userCount = Users.find({'profile.email': email}).count();

    if (userCount > 1) {
        var oldUser = Users.findOne({"profile.email": email, info: {$exists: true}}); // creepy
        var newUser = Users.findOne({"profile.email": email, 'services.google': {$exists: true}});

        console.log("RECONNECT " + oldUser.profile.email);
        // we have a newUser invitation
        newUser.info = oldUser;
        newUser.profile.received = oldUser.profile.received;
        // assign kudos
        Kudos.update({toId: oldUser._id}, {$set: {toId: newUser._id}}, {multi:true});
        // delete old newUser
        Users.remove(oldUser._id);
        Users.update(newUser._id, newUser);
    }
};

sendNotificationEmail = function(fromUser, toUser, kudo) {

    var options = {
        to: toUser.profile.email,
        from: 'kudos@byte-code.com',
        subject: "Ehi, " + fromUser.profile + " gave you some love!",
        text: "Visit http://kudo-box.meteor.com/share/"+ kudo +" and see your kudo!"
    };

    Email.send(options);
};
