oo.define({
    //"templateEngine": "handlebars",
    "viewportSelector": "#viewport"
});

oo.bootstrap(function (oo) {

    //create routes
    var routesList = {
        'index': {
            url: '/home',
            controller: 'index',
            action: 'index'
        },
        'article':{
            url : '/index/article',
            controller:'index',
            action: 'article'
        }
    };

    var r = oo.getRouter();
    r.addRoutes(routesList);
    r.init();


    // layout
    (function (oo) {
        // example :
        // oo.createElement('button', {
        //     el: '#globalnav-nav #item-xxx',
        //     onrelease: function onrelease () {
        //         // ...
        //     }
        // });
    })(oo);

    
});