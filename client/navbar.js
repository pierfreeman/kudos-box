
Template.navbar.events({
    'click a.drop': function() {
        Meteor.call('removeLastKudo');
        return false;
    }
});

Template.navbar.helpers({});
