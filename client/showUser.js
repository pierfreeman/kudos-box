
Template.showUser.user = function() {
    return Users.findOne(Session.get('showUser._id'));
};

Template.showUser.events({

    'click a.leave_domain' : function(e, t) {
        e.preventDefault();
        Meteor.call("removeFromDomain", Session.get('showUser._id'), function(e, r) {
            console.log(e);
        });
        
    }
});

Template.kudo_short_given_list.kudos = function() {
    return Kudos.find({ fromId: Session.get('showUser._id') }, { sort: { when: -1 }});
};

Template.kudo_short_received_list.kudos = function() {
    return Kudos.find({ toId: Session.get('showUser._id') }, { sort: { when: -1 }});
};

Template.kudo_short_given.helpers({

    to: function() {
        return safeName(Users.findOne(this.toId));
    },
    prettyWhen: function () {
        return moment(this.when).fromNow();
    }
});

Template.kudo_short_received.helpers({

    from: function() {
        return safeName(Users.findOne(this.fromId));
    },
    prettyWhen: function() {
        return moment(this.when).fromNow();
    }
});

Template.kudo_short_details.helpers({

    likes: function() {
        var kudo = Kudos.findOne({_id: this._id});
        return kudo.likes ? kudo.likes.length : 0;
    },
    comments: function() {
        var kudo = Kudos.findOne({_id: this._id});
        return kudo.comments ? kudo.comments.length : 0;
    }
});

Template.kudo_short_details.events({

    'click a.public-link': function(e, t) {
        e.preventDefault();
        window.open('http://' + document.location.host + '/share/' + this._id);
    }
});



