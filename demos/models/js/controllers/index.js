(function (oo) {
    //create controller
    var IndexController = oo.createController({
        indexAction : function indexAction(params){
            var v = this.getViewport();

            /*if(params.all){
                //model.get('value');
            }*/

            v.switchPanel('home', oo.view.Viewport.ANIM_LTR);
        },
        articleAction: function articleAction(params){
            
            var data = app.model.mag.get(params.id);
            var v = this.getViewport();

            v.switchPanel("home",'article', oo.view.Viewport.ANIM_LTR, {
                dataArticle: data
            });
        }
    });

    oo.getRouter().addController('IndexController', IndexController);
})(oo);