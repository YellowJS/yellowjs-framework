var app = (function () {
    
    var app = {};
    //app.stores = {};    
    
    window.addEventListener('load', function () {
        
        setTimeout( function () {
            
            // hide address bar
            window.scroll(0,0); 

            // prevent page scrolling
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        
            //app.use_anim = oo.view.Viewport.NO_ANIM;
        
            //app.viewport = new oo.view.Viewport();

            oo.Router.routes = {
                'index': {
                    url: '/home',
                    controller: 'index',
                    action: 'index'
                },
                'list-article': {
                    url: '/index/categ',
                    controller: 'index',
                    action: 'categ'
                },
                'article': {
                    url: '/index/article',
                    controller: 'index',
                    action: 'article'
                }
            };

            oo.Router.init();
            
        }, 1000);
        
    }, false);
    
    return app;
    
})();