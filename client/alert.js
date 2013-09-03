Template.alert_list.alerts = function(){
        return alertList.find({});
};

Template.alert.events({
    'click button': function(event){
        alertList.remove(this._id);
        return false;
    }
});

Template.alert.rendered = function(){
    var thisId = this.data._id;
    var thisAlert = alertList.find(thisId);
    if (thisAlert.collection.docs[thisId].sticky === false) {
        window.setTimeout(function() {
            $("#"+thisId).fadeTo(500, 0).slideUp(500, function(){
                $(this).remove(); 
                alertList.remove(thisId);
            });
        }, 3000);
    }   
};