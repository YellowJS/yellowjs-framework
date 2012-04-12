oo.define({
    //"templateEngine": "handlebars",
    "viewportSelector": "#viewport"
});

oo.bootstrap(function() {
    
    //create routes
    var routesList = {
        'index': {
            url: '/index',
            controller: 'index',
            action: 'index'
        },
        'detail': {
            url: '/detail',
            controller: 'index',
            action: 'detail'
        }
    };

    var r = oo.getRouter();
    r.addRoutes(routesList);
    r.init();

});