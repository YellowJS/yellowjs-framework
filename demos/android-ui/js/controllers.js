var CONTROLLERS = (function(CONTROLLERS) {
    CONTROLLERS.IndexController = {

        indexAction: function indexAction() {
            oo.getViewport().show('super-id', function (panel) {
                var b = panel.getEl('my-first-btn');

                b.addListener(oo.view.Button.EVT_RELEASE, function () {
                    alert('Hello World');
                });

            });
        },
        
        // indexAction: function indexAction () {
        //     if (!app.viewport.hasPanel('home')) {
        //         app.viewport.addPanel(TEMPLATES.home, 'home', false, true);

        //         app.viewport.addListener('onEnablePanel', function () {
        //             var f = new oo.view.Button('.folder');

        //             f.addListener(oo.view.Button.EVT_TOUCH, function () {
        //                 console.log('folder');
        //             });

        //             var a = new oo.view.Button('.btn-apps');

        //             a.addListener(oo.view.Button.EVT_RELEASE, function () {
        //                console.log('apps');
        //                oo.Router.load('/apps');
        //             });

        //         }, app.viewport.getPanel('home'))

        //     }   
            
        //     app.viewport.switchPanel('home', app.use_anim);
        //     //app.use_anim = oo.Viewport.ANIM_RTL;
        // },

        appsAction: function appsAction () {
            if (!app.viewport.hasPanel('apps')) {
                app.viewport.addPanel(TEMPLATES.apps, 'apps', false, true);

                app.viewport.addListener('onEnablePanel', function () {

                    var c = new oo.view.Carousel('.apps-list', false);
                    // var f = new oo.view.Button('.folder');

                    // f.addListener(oo.view.Button.EVT_TOUCH, function () {
                    //     console.log('folder');
                    // });

                    // var a = new oo.view.Button('.btn-apps');

                    // a.addListener(oo.view.Button.EVT_TOUCH, function () {
                    //    console.log('apps'); 
                    // });

                }, app.viewport.getPanel('apps'))

            }   
            
            app.viewport.switchPanel('apps', app.use_anim);
            //app.use_anim = oo.Viewport.ANIM_RTL;
        }
    }
    
    return CONTROLLERS;

})(CONTROLLERS || {});