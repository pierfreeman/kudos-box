
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

    user.profile = profile;
    user.enabled = true;
    user.balance = {
        sent: 0,
        received: 0,
        spendable: 100, //TODO change this number with 0 and implement a job that $inc them by policy
        currency: 0
    };
    
    //conta admin
    var adminCount = Users.find({'profile.admin': true, 'profile.domain': user.profile.domain}).count();
    if (adminCount === 0) {
        profile.admin = true;
    }

    // no callback after user creation
    Meteor.setTimeout(function() {
        console.log('reconnect {1}'.assign(user.profile.email));
        reconnectAccounts(user.profile.email);
    }, 3000);

    return user;
});
