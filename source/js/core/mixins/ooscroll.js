/**
 * Contains class for scroll
 *
 * @namespace oo.core.mixins
 * @class Scroll
 */
(function (oo) {
    
    //var listeners = {};
    
    //var Events = {};
    
    var global = this;
    
    var Scroll = oo.getNS('oo.core.mixins').Scroll = oo.Class({
        _scroll : null,
        _createScroll : function _createScoll () {
            if (null === this._scroll)
                return new (oo.view.scroll.Scroll.get(oo.getConfig('scroll')))();
        },
        setScrollable : function setScrollable(){
            this._scroll = this._createScoll();
        }
    });
        
})(oo || {});