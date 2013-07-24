
Template.navbar.events({
    'click a.drop': function() {
        var one = Kudos.findOne({}, {sort: {when: -1}});
        Kudos.remove(one._id);
        return false;
    }
});

Template.navbar.helpers({});
