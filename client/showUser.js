
Template.showUser.user = function() {

    return Users.findOne( Session.get( 'showUser._id' ) );
}

Template.receivedKudos.helpers({
    kudos: function() {
        return Kudos.find({toId: Session.get( 'showUser._id' )});
    },
    tot: function() {
        return Kudos.find({toId: Session.get( 'showUser._id' )}).count();
    }
});

Template.givenKudos.helpers({
    kudos: function() {
        return Kudos.find({fromId: Session.get( 'showUser._id' )});
    },
    tot: function() {
        return Kudos.find({fromId: Session.get( 'showUser._id' )}).count();
    }
});

