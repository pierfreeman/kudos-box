// A Kudo class that takes a document in its constructor
Kudo = function (doc) {
    _.extend(this, {when: new Date()}, doc);
};
//_.extend(Kudo.prototype, {});

Kudo.prototype = {
    constructor: Kudo,
    save: function () {
        Kudos.insert(this);
    }
};

// Define a Collection that uses Kudo as its document
Kudos = new Meteor.Collection("kudos", {
    transform: function (doc) { return new Kudo(doc); }
});

/*// A Kudo class that takes a document in its constructor
GroupDomain = function (doc) {
    _.extend(this, doc);
};
_.extend(GroupDomain.prototype, {});

// Define a Collection that uses Kudo as its document
GroupDomains = new Meteor.Collection("groupDomain", {
    transform: function (doc) { return new GroupDomain(doc); }
});*/

