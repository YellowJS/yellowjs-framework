/**
 * Contains class for scroll
 *
 * @namespace oo.core.mixins
 * @class Scroll
 */
(function (oo) {
    
    var global = this;
    
    var Scroll = oo.getNS('oo.core.mixins').Scroll = oo.Class({
        _createScroll : function _createScoll () {
            if (null === this.scroll)
                return new (oo.view.scroll.Scroll.get(oo.getConfig('scroll')))();
        },
        setScrollable : function setScrollable(){
            this.scroll = null;
            this.scroll = this._createScroll();
        }
    });
        
})(oo || {});