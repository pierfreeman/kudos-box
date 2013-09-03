Meteor.methods({

    decrementPeriod: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.period': -1}});
    },

    incrementPeriod: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.period': 1}});
    },

    decrementAwarded: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.kudosForPeriod': -1}});
    },

    incrementAwarded: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.kudosForPeriod': 1}});
    },

    decrementDomainSpendable: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.maxSpendableKudosAllowed': -1}});
    },

    incrementDomainSpendable: function(domain) {
        return Domains.update({_id: domain._id}, {$inc: {'rules.maxSpendableKudosAllowed': 1}});
    }
});