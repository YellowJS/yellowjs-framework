(function (doc, oo) {
    
    var ArticlePanel = oo.createPanel({
        id:'article',
        node : null,
        init: function init () { this.setTemplate(doc.querySelector('#tpl-article').innerHTML); },
        onEnabled: function onEnabled (params) {
            
            this.node = oo.createElement('node',{
                el : '#article-view',
                template : doc.querySelector('#tpl-article-view').innerHTML
            });


            /*wtf*/
            //node.renderTo(node, params.articledata);
        },
        onShow : function onShow(params){
            if(params && this.node){
                this.node.clear();
                this.node.renderTo(this.node, params.dataArticle);
            }
        }

    });

})(document,oo);