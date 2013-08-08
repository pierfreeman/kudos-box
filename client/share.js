
Template.share.created = function() {

    var shareId = Session.get('share._id');
    check(shareId, String);

    Meteor.call('peekKudo', shareId, function(err, result) {
        Session.set('share.kudo', result);
    });

};

Template.share.helpers({
    kudo: function() {
        return Session.get('share.kudo');
    }
});