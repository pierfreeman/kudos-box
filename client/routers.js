
Meteor.Router.beforeRouting = function() {
    // anything you like before routing
};

Meteor.Router.add({

    '/': 'timeline',

    'timeline': 'timeline',

    '/home': 'home',

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

    '/balance': 'balance',

    '*': 'not_found'
});

Meteor.Router.filters({
    'checkLoggedIn': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            return page;
        } else {
            return 'home';
        }
    }
});

Meteor.Router.filter('checkLoggedIn', {except: 'home'});