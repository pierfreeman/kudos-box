
Accounts.onCreateUser(function(options, user) {
    // We still want the default hook's 'profile' behavior.
    var profile;

    if (options.profile)
        profile = options.profile;
    else if (user.profile) {
        profile = user.profile;
    } else {
        profile = {};
    }

    setupUserProfileByService( profile, user );

    profile.sent = 0;
    profile.received = 0;

    user.profile = profile;

    return user;
});
