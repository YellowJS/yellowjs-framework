/**
 * @namespace oo.view.scroll
 * @class IScroll
 * @requires oo.view.Dom, oo.core.Touch
 */
(function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch, Scroll = oo.view.scroll.Scroll;
    
    var IScroll = oo.getNS('oo.view.scroll').IScroll = oo.Class(Scroll, {
        constructor : function constructor() {
            IScroll.Super.call(this);
        }
    });

    Scroll.register(IScroll, 'iscroll');

})(oo || {});   