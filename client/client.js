

Template.kudo_form.rendered = function() {
    return $('input#to').typeahead({
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
    'click button' : function () {
        // template data, if any, is available in 'this'
        var to = $('#to').val();
        var reason = $('#reason').val();

        if ( to != '' && reason != '' ) {

            var theOne = Users.findOne({'profile.name': to});
            if (theOne == null) {
                alert("I can't find this guy!");
                return false;
            }

            if (theOne._id == Meteor._id) {
                alert("Make love with somebody else, please!");
                return false;
            }

            $('#to').val('');
            $('#reason').val('');

            var kudo = new Kudo({
                toId: theOne._id,
                fromId: Meteor.user()._id,
                reason: reason
            });

            kudo.save();

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
    }
});

Template.navbar.events({
    'click a.drop': function() {
        var one = Kudos.findOne({}, {sort: {when: -1}});
        Kudos.remove(one._id);
        return false;
    }
});

Meteor.setInterval(function() {
    $('.prettyTime').each(function() {
        $(this).html( moment( $(this).attr('time') ).fromNow() );
    });
}, 5000);

var safeName = function(user) {
    if (user) {
        return user.screenName();
    } else {
        return 'MISSING';
    }
}