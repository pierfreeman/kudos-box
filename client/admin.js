Template.admin.created = function() {
    Session.setDefault('user.edit', undefined);
};

Template.admin.events({

    'click a.drop': function() {
        Meteor.call('removeLastKudo');
        return false;
    },

    'click a.dropall': function() {
        Meteor.call('removeAllKudos');
        return false;
    }
});

Template.users_table.users = function() {
    var user = Meteor.user();
    if (!Meteor.loggingIn()) {
        return Users.find({ "profile.domain" : user.profile.domain });
    }
    return false;
};

Template.users_table.events({

    'click button.resetUsers': function() {
        Meteor.call('initializeUserBalance');
    }
});

Template.admin.helpers({

    'domain': function() {
        var user = Meteor.user();
        if (!Meteor.loggingIn()) {
            return user.profile.domain;
        }
        return false;
    }
});

Template.user_detail.helpers({

    editUser: function() {
        return Session.get('user.edit') == this._id;
    }
});

Template.user_detail.events({

    'click .edit_user': function(e, t) {
        e.preventDefault();
        Session.set('user.edit', this._id);
    },

    'click button.reset': function(e, t) {
        e.preventDefault();
        Meteor.call("resetCounters", this._id, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    },

    'click button.disable': function(e, t) {
        e.preventDefault();
        Meteor.call("triggerUserStatus", this._id, false, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    },

    'click button.enable': function(e, t) {
        e.preventDefault();
        Meteor.call("triggerUserStatus", this._id, true, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    }
});


