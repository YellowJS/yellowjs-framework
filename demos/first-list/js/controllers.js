var CONTROLLERS = (function(CONTROLLERS) {
    CONTROLLERS.IndexController = {

        indexAction: function indexAction() {
            oo.getViewport().show('list-categ', function (panel) {
                
                panel.getEl('categories').addListener(oo.view.List.EVT_ITEM_RELEASED, function (el, itemKey) {
                    oo.Router.load('/index/categ/categ/' + itemKey);
                });

                model.fetch();
            });
        },

        categAction: function categAction(params) {
            oo.getViewport().addPanel('list-article', false, true);
            oo.getViewport().switchPanel('list-article');
            // function (panel) {

            //     articlesModel.fetch({params: {categ: params.categ}});

            //     panel.getEl('articles').addListener(oo.view.List.EVT_ITEM_RELEASED, function (el, itemKey) {
            //         oo.Router.load('/index/article/id/' + itemKey);
            //     });
            // };
        },

        articleAction: function articleAction() {
            oo.getViewport().show('article', function (panel) {
                oneArticleModel.fetch({article: params.article});
            });
        }
                
    };
    
    return CONTROLLERS;

})(CONTROLLERS || {});