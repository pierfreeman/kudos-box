Template.balance.users = function() {
    return Users.find({});
}

Template.balance.events = {
    'click button.resetUsers': function() {
        Meteor.call('initializeUserBalance');
    }
};
