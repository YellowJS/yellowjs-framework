/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

(function (oo) {
    var Pager = oo.getNS('oo.view').Pager = oo.Class(oo.view.List, oo.core.mixins.Events, {
        STATIC : {
            NAVIGATE:'navigate'
        },
        constructor:  function constructor(opt){
            if(!opt){
                throw new Error ('Missing options');
            }

            Pager.Super.call(this, opt);
            this._attachEvents();

        },
        _attachEvents : function _attachEvents(){
            var that = this;
            /*this.addListener(List.EVT_ITEM_RELEASED, function(el,id){
                //add method fetch model
                
                    var url = that._model.get(id).data('url');
                    trigger event for rooter
                    Event.triggerEvent('navigate'n url)

                
                //that.triggerEvent(Pager.NAVIGATE, ['test']);
                //var router = oo.getRouter();
                router.load(url);

            });*/
        }
    });

    oo.view.Element.register(Pager, 'pager');

})(oo||{});