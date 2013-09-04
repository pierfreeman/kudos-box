Meteor.setInterval(function() {
    $('.prettyTime').each(function() {
        $(this).html( moment( $(this).attr('time') ).fromNow() );
    });
}, 5000);

createAlert = function(level, message, sticky) {
    alertList.insert({
        _id: makeAlertId(),
        sticky: sticky,
        message: message,
        level: level //"error": red alert, "success": green alert, "info": blue alert 
    });
};

getUserWithoutDomain = function() {
    return Users.findOne({_id: Session.get('userWithoutDomain')});
};

getDefaultDomainByUser = function(user) {
    return Domains.findOne({name: user.profile.email.split('@')[1]});
};

getCurrentDomainByUser = function(user) {
    if (!Meteor.loggingIn()) {
        return Domains.findOne({name: user.profile.domain});
    }
    return false;
};

