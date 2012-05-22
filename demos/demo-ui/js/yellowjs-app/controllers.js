oo.createControllerClass('IndexController', {
    indexAction : function indexAction(){
        this._viewport.switchPanel('home');
    },
    detailAction : function detailAction(params) {

        this._viewport.switchPanel(params.feature);

    }
});