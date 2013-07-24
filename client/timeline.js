Template.kudo_form.rendered = function() {
    return $('input[name=to]').typeahead({
        source: function(query, process) {

            var users = Users.find({
                'profile.name': new RegExp(query, 'i')
            }, {limit: 5}).fetch();

            users = pluck(users, 'profile');
            users = pluck(users, 'name');
            //console.log('found users:' + users.join(', '));
            return users; // call process(users) for async
        },
        items: 5
    });
};

Template.kudo_form.from = function () {
    return Meteor.userId();
};

Template.kudo_form.events({
    'click button' : function (event, tmpl) {

        event.preventDefault();

        // template data, if any, is available in 'this'
        var inputTo = tmpl.find('[name=to]');
        var inputReason = tmpl.find('[name=reason]');

//        console.log(inputTo);
//        console.log(inputReason);

        var to = inputTo.value;
        var reason = inputReason.value;

        if ( to != '' && reason != '' ) {

            var currentUser = Meteor.user();

            var targetUser = Users.findOne({'profile.name': to});

            if (targetUser == null) {
                // test if it's a valid domain
                if (to.indexOf( currentUser.profile.domain ) && isEmail(to)) {
                    Meteor.call('newUserByEmail', to);
                } else {
                    alert("I can't find this guy!");
                }
                return false;
            }

            if (targetUser._id === currentUser._id) {
                alert("Make love with somebody else, please!");
                return false;
            }

            inputTo.value = '';
            inputReason.value = '';

            Meteor.call("emitKudo", targetUser, reason, function(error, result){
                console.log('emitKudo ');
                console.log(result);
            });

        } else {
            alert('Are u making fun of me?');
        }

        return false;
    }
});

Template.kudo_list.kudos = function () {
    return Kudos.find({}, {sort: {when: -1}});
};

Template.kudo.helpers({

    prettyWhen: function () {
        return moment(this.when).fromNow();
    }
    ,from: function() {
        return safeName(Users.findOne(this.fromId));

    }
    ,to: function() {
        return safeName(Users.findOne(this.toId));
    },
    totalLikes: function() {
        // the IFerno!
        if (this.likes) {
            if (this.likes.any(Meteor.userId)) {
                var youAndOthers = 'you';
                if (this.likes.length > 1) {
                    youAndOthers = youAndOthers + '+' + (this.likes.length-1);
                }
                return youAndOthers
            } else {
                return this.likes.length;
            }
        } else {
            return 0;
        }
    }
});

Template.kudo.events({
    'click a.like-it': function(event, templ) {
        Meteor.call('likeKudo', this._id);
    }
});


var safeName = function(user) {
    if (user) {
        return user.screenName();
    } else {
        return 'MISSING';
    }
};