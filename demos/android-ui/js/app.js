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
                    url: '/index',
                    controller: 'index',
                    action: 'index'
                },
                'folder': {
                    url: '/toggle-folder',
                    controller: 'index',
                    action: 'HPUContacts'
                },
                'apps': {
                    url: '/apps',
                    controller: 'index',
                    action: 'apps'
                }
            };

            oo.Router.init();
            
        }, 1000);
        
    }, false);
    
    return app;
    
})();