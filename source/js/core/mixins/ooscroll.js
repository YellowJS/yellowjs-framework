/**
 * Contains class for scroll
 *
 * @namespace oo.core.mixins
 * @class Scroll
 */
(function (oo) {
    
    var global = this;
    
    var Scroll = oo.getNS('oo.core.mixins').Scroll = oo.Class({
        _createScroll : function _createScoll (opt) {
            if (null === this.scroll){
                if(undefined === opt){
                    opt = {};
                }

                if(!opt.hasOwnProperty("el")){
                    opt.el = this;
                }

                return new (oo.view.scroll.Scroll.get(oo.getConfig('scroll')))(opt);
            }
        
        },
        setScrollable : function setScrollable(opt){
            this.scroll = null;
            this.scroll = this._createScroll(opt);
        }
    });
        
})(oo || {});