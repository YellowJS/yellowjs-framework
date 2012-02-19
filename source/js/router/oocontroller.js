/**
 * Base class to implement controllers logic
 *
 * @namespace oo.router
 * @class Controller
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function(oo){

    var Controller = oo.getNS('oo.router').Controller = oo.Class({
        _controllers : {},
        // protected
        _viewport: null,
        constructor : function constructor(){
            this._viewport = oo.getViewport();
        },
        // deprecated - use the class member instead
        getViewport: function getViewport() {
            return oo.getViewport();
        }
    });
 
})(oo || {});
