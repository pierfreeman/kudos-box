var PAGE_SIZE = 10;

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

Template.kudo_list.created = function() {

    Session.set("current_page", 1);

    $(window).scroll(function() {
        if (($(window).innerHeight() + $(window).scrollTop()) >= $("body").height())   {
            var currentpage = Session.get('current_page');
            Session.set('current_page', currentpage + 1);
        }
    });

    Session.setDefault('kudo.showComments', {});
};

Template.kudo_new_comment.events({

    'click button' : function (event, tmpl) {

        event.preventDefault();

        var message = tmpl.find('[name=message]');

        if (message.value == '') {
            return false;
        }

        Meteor.call("emitComment", this, message.value, function (error, result) {
            console.log("emitComment: " + result);
        });

        message.value = '';
        return false;
    }
});

Template.kudo_list.kudos = function () {
    return Kudos.find({}, {
        limit: Session.get("current_page")*PAGE_SIZE,
        sort: {when: -1}
    });
};

Template.kudo_form.events({

    'click button' : function (event, tmpl) {

        event.preventDefault();

        // template data, if any, is available in 'this'
        var inputTo = tmpl.find('[name=to]');
        var inputReason = tmpl.find('[name=reason]');
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

            Meteor.call("emitKudo", targetUser, reason, function(error, result) {
                console.log('emitKudo ');
                console.log(result);
            });

        } else {
            alert('Are u making fun of me?');
        }
        return false;
    }
});

Template.kudo.events({

    'click a.like-it': function(event, templ) {
        if (_.contains(this.likes, Meteor.userId())) {
            console.log('Like');
            Meteor.call('unlikeKudo', this._id);
        } else {
            console.log('unLike');
            Meteor.call('likeKudo', this._id);
        }
    },

    'click a.comment-it': function(event, tmpl) {

        event.preventDefault();

        var showComments = Session.get('kudo.showComments');
        if (_.has(showComments, this._id)) {
            Session.set('kudo.showComments', _.omit(showComments, this._id))
        } else {
            showComments[this._id] = true;
            Session.set('kudo.showComments', showComments);
        }
    },

    'click a.public-link': function(event, tmpl) {

        event.preventDefault();
        window.open('http://' + document.location.host + '/share/' + this._id);
    }
});

Template.kudo.helpers({

    prettyWhen: function () {
        return moment(this.when).fromNow();
    },
    from: function() {
        return safeName(Users.findOne(this.fromId));
    },
    to: function() {
        return safeName(Users.findOne(this.toId));
    },
    fromPicture: function() {
        var user = Users.findOne(this.fromId);
        if (user) {
            return user.profile.picture;
        }
        return false;
    },
    isLiked: function() {
        if (_.contains(this.likes, Meteor.userId())) {
            return "Liked";
        } else {
            return "Like";
        }
    },
    totalLikes: function() {
        if(this.likes) {
            return this.likes.length;
        } else {
            return 0;
        }
    },
    showComments: function()  {
        return Session.get('kudo.showComments')[this._id];
    }
});

Template.kudo_comment.helpers({

    prettyWhen: function () {
        return moment(this.when).fromNow();
    },
    author: function() {
        return safeName(Users.findOne(this.author));
    },
    authorPicture: function() {
        return Users.findOne(this.author).profile.picture;
    }
});
