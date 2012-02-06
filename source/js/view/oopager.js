/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {
    
    var Touch = oo.core.Touch, List = oo.view.List, Events = oo.core.mixins.Events, ns = oo.getNS('oo.view');

    var Pager = ns.Pager = my.Class(List, Events, {
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
            this.addListener(List.EVT_ITEM_RELEASED, function(el,id){
                //add method fetch model
                /*
                    var url = that._model.get(id).data('url');
                    trigger event for rooter
                    Event.triggerEvent('navigate'n url)

                */
                that.triggerEvent(Pager.NAVIGATE, ['test']);

            });
        }
    });

    oo.view.Element.register(Pager, 'pager');

    return oo;
})(oo);