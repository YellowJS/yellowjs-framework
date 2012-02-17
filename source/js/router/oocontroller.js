/**
 * Class providing url routing logic
 * handle management of history API
 *
 * @namespace oo
 * @class Router
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function(oo){


    var ns = oo.getNS('oo.router');

    var Controller = ns.Controller = my.Class({
        _controllers : {},
        constructor : function constructor(){},
        getViewport: function getViewport() {
            return oo.getViewport();
        }
    });
 
    return oo;

})(oo || {});
