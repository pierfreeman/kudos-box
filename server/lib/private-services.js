
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

    Users.update(this.fromId, {$inc: {'profile.sent': 1}});
    Users.update(this.toId, {$inc: {'profile.received': 1}});
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
