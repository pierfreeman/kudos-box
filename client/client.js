Meteor.setInterval(function() {
    $('.prettyTime').each(function() {
        $(this).html( moment( $(this).attr('time') ).fromNow() );
    });
}, 5000);


