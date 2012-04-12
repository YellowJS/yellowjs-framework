oo.createController('IndexController', {
    indexAction : function indexAction(){
        this.getViewport().switchPanel('home');
    },
    detailAction : function detailAction(params) {

        this.getViewport().switchPanel(params.feature);

    }
});