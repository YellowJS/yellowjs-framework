(function (doc, oo) {
    
    var HomePanel = oo.createPanel({
        id:'home',
        init: function init () { this.setTemplate(doc.querySelector('#tpl-home').text); },
        onEnabled: function onEnabled () {
            
            var list = oo.createElement('list', {
                el : '#list',
                template : doc.querySelector('#tpl-list').innerHTML,
                model : app.model.mag,
                refresh: function refresh(params){
                    //oo.getRouter().load("/index/criteria/all");
                }
            });

            list.addListener(oo.view.List.EVT_ITEM_RELEASED, function(el,key){
                oo.getRouter().load('/index/article/id/'+key);
            });

            app.model.mag.fetch(function(data){
                list.render(data);
            });


            /*var btnR = oo.createElement('button', {
                el : "#refresh",
                onrelease : function onrelease(){
                    list.refresh(params);
                }
            });*/
        }

    });

})(document,oo);