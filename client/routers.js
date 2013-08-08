
Meteor.Router.beforeRouting = function() {
    // anything you like before routing
};

Meteor.Router.add({

    '/': 'timeline',
    '/timeline': 'timeline',

    '/home': 'home',

    '/about': 'about',

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
            throw new Meteor.Error(401, 'This page requires administration rights');
        }
    }    
});

Meteor.Router.filter('checkLoggedIn', {except: ['home', 'share']});

Meteor.Router.filter('checkAdmin', {only: ['admin']});