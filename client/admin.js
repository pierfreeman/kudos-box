Template.admin.created = function() {
    Session.setDefault('user.edit', undefined);
};

Template.admin.events({

    'click button.less_days': function(e, t) {
        e.preventDefault();
        Meteor.call('decrementPeriod', getCurrentDomainByUser(Meteor.user()));
    },

    'click button.more_days': function(e, t) {
        e.preventDefault();
        Meteor.call('incrementPeriod', getCurrentDomainByUser(Meteor.user()));
    },

    'click button.less_kudos': function(e, t) {
        e.preventDefault();
        Meteor.call('decrementAwarded', getCurrentDomainByUser(Meteor.user()));
    },

    'click button.more_kudos': function(e, t) {
        e.preventDefault();
        Meteor.call('incrementAwarded', getCurrentDomainByUser(Meteor.user()));
    },

    'click button.less_spendable': function(e, t) {
        e.preventDefault();
        Meteor.call('decrementDomainSpendable', getCurrentDomainByUser(Meteor.user()));
    },

    'click button.more_spendable': function(e, t) {
        e.preventDefault();
        Meteor.call('incrementDomainSpendable', getCurrentDomainByUser(Meteor.user()));
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
            return Domains.findOne({name: user.profile.domain});
        }
        return false;
    }
});

Template.user_detail.helpers({

    editUser: function() {
        return Session.get('user.edit') == this._id;
    },

    notAdmin: function() {
        return !this.profile.admin;
    }
});

Template.user_detail.events({

    'click a.edit_user': function(e, t) {
        e.preventDefault();
        Session.set('user.edit', this._id);
    },

    'click a.exitEdit': function(e, t) {
        e.preventDefault();
        Session.set('user.edit', undefined);
    },

    'click button.reset': function(e, t) {
        e.preventDefault();
        Meteor.call("resetCounters", this._id, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    },

    'click button.remove': function(e, t) {
        e.preventDefault();
        Meteor.call("removeFromDomain", this._id, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    },

    'click button.give': function(e, t) {
        e.preventDefault();
        Meteor.call("giveAdminRights", this._id, function (error, result) {
            console.log(result);
            Session.set('user.edit', undefined);
        });
    },

    'click button.more_kudo': function(e, t) {
        e.preventDefault();
        Meteor.call('incrementSpendable', this, function(e, r) {
            console.log(e);
        });
    },

    'click button.less_kudo': function(e, t) {
        e.preventDefault();
        Meteor.call('decrementSpendable', this, function(e, r) {
            console.log(e);
        });
    }
});
