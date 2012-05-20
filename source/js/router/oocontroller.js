/**
 * Base class to implement controllers logic
 *
 * @namespace oo.router
 * @class Controller
 * @requires oo.view.Viewport
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function(oo){

    var Controller = oo.getNS('oo.router').Controller = oo.Class({
        _controllers : {},
        // protected
        _viewport: null,
        _Viewport: null,
        constructor : function constructor(){
            this._viewport = oo.getViewport();
            this._Viewport = oo.view.Viewport;
        },
        // deprecated - use the class member instead
        getViewport: function getViewport() {
            console.warn('the getViewport method of the class Controller is deprecated !');
            return oo.getViewport();
        }
    });
 
})(oo || {});
