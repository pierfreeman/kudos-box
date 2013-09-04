// A Domain class that takes a document in its constructor
GroupDomain = function (doc) {
    _.extend(this, doc);
};

GroupDomain.prototype = {
    constructor: GroupDomain
};

// Define a Collection that uses Domain as its document
Domains = new Meteor.Collection("domains", {
    transform: function (doc) { return new GroupDomain(doc); }
});