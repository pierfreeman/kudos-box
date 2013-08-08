
Template.showUser.user = function() {
    return Users.findOne(Session.get('showUser._id'));
};

Template.kudo_short_given_list.kudos = function() {
    return Kudos.find({ fromId: Session.get('showUser._id') }, { sort: { when: -1 }});
};

Template.kudo_short_received_list.kudos = function() {
    return Kudos.find({ toId: Session.get('showUser._id') }, { sort: { when: -1 }});
};

Template.kudo_short.helpers({

    from: function() {
        return safeName(Users.findOne(this.fromId));
    },
    to: function() {
        return safeName(Users.findOne(this.toId));
    },
    prettyWhen: function () {
        return moment(this.when).fromNow();
    }
});

