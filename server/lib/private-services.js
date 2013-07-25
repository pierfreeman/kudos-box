
// Private Methods

emitKudo = function(fromUser, toUser, reason) {

    var kudo = new Kudo({
        toId: toUser._id,
        fromId: fromUser._id,
        domain: fromUser.profile.domain,
        reason: reason
    });

    console.log("KUDO in {domain} from {from} to {to} because {reason} ".assign({
        from: fromUser.profile.name,
        to:   toUser.profile.name,
        domain: kudo.domain,
        reason: kudo.reason
    }));

    Users.update(fromUser._id, {$inc: {'profile.sent': 1}});
    Users.update(toUser._id, {$inc: {'profile.received': 1}});
    kudo.save();
    return kudo;
}

setupUserProfileByService = function (profile, user) {

    if (user.services) {
        if (user.services.google) {
            var google = user.services.google;
            profile.email = google.email;
            profile.picture =  google.picture;
            profile.domain = getDomain(profile.email);
        }
    }
}

likeKudo = function (userId, kudoId) {

    Kudos.update({_id:kudoId}, { $addToSet: { likes: userId } });
};

sendInvitationEmail = function(userId) {

    var invited = Users.findOne(userId);
    var referral = Users.findOne(invited.info.referralUserId);

    var options = {
        to: invited.profile.email,
        from: 'kudos@byte-code.com',
        subject: "Ehi, {name} gave you some love!".assign(referral.profile),
        text: "Visit http://kudos-box.meteor.com and join us!"
    };

    Email.send(options);
}

reconnectAccounts = function(email) {

    var userCount = Users.find({'profile.email': email}).count();

    if (userCount > 1) {
        var oldUser = Users.findOne({"profile.email": email, info: {$exists: true}}); // creepy
        var newUser = Users.findOne({"profile.email": email, 'services.google': {$exists: true}});

        console.log("RECONNECT {profile.email}".assign(oldUser, {newId: newUser._id}));
        // we have a newUser invitation
        newUser.info = oldUser;
        newUser.profile.received = oldUser.profile.received;
        // assign kudos
        Kudos.update({toId: oldUser._id}, {$set: {toId: newUser._id}}, {multi:true});
        // delete old newUser
        Users.remove(oldUser._id);
        Users.update(newUser._id, newUser);

    }

}
