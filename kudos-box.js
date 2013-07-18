
// An User class that takes a document in its constructor
User = function (doc) {
    //this.screenName = doc.profile.name;
  _.extend(this, doc);
};

//_.extend( User.prototype, {});

User.prototype = {
    constructor: User,
    screenName: function () {
        return this.profile.name;
    }
};



// Define a Collection that uses User as its document
Meteor.users._transform = function( doc ){ return new User(doc);};

Users = Meteor.users;