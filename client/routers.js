
Meteor.Router.beforeRouting = function() {
    alertList.remove({});
};

Meteor.Router.add({

    '/': 'timeline',
    '/timeline': 'timeline',

    '/home': 'home',

    '/about': 'about',

    '/domain': 'chooseDomain',

    '/share/:id' : function(id) {

        console.log('we are at ' + this.canonicalPath);
        console.log("our parameters: " + this.params);

        Session.set('share._id', id);
        return 'share';
    },

    '/users/:screenName': function(screenName) {

        console.log('we are at ' + this.canonicalPath);
        console.log("our parameters: " + this.params);

        var selectedUser = Users.findOne({'profile.name': screenName});

        if (selectedUser) {
            Session.set('showUser._id', selectedUser._id);
            return 'showUser';
        } else {
            return 'not_found';
        }
    },

    '/admin': 'admin',
    
    '*': 'not_found'
});

Meteor.Router.filters({

    'checkLoggedIn': function(page) {

        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            if (!Meteor.loggingIn()) {
                var user = Meteor.user();
                if (!user.profile.domain) {
                    Session.set('userWithoutDomain', user._id);
                    return 'chooseDomain';
                }
                return page;
            } else {
                return 'loading';
            }
        } else {
            return 'home';
        }
    },

    'checkAdmin' : function(page) {
        if (Meteor.userId() && Meteor.user().profile.admin) {
            return page;
        } else {
            return 'timeline';
        }
    }    
});

Meteor.Router.filter('checkLoggedIn', {except: ['home', 'share']});

Meteor.Router.filter('checkAdmin', {only: ['admin']});