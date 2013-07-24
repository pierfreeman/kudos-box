
if (Meteor.isClient) {

    Meteor.subscribe("kudos", Meteor.user().profile.domain);
    Meteor.subscribe("allUserData");
}

if (Meteor.isServer) {

    Meteor.publish("kudos", function(currentDomain) {
        //return Kudos.find({domain: Meteor.user().domain});
        return Kudos.find({domain: currentDomain});
    });

    Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {
            fields: {
                profile: 1
            }
        });
    });


}

